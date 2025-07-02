const SeatReservation = require('../models/SeatReservation');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// @desc    Reserve seats temporarily (5 minutes)
// @route   POST /api/reservations/reserve
// @access  Private
const reserveSeats = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { showId, seats } = req.body;
    const userId = req.user.id;

    // Check if show exists and is active
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    if (!show.isActive || show.status !== 'scheduled') {
      return res.status(400).json({ error: 'Show is not available for booking' });
    }

    // Check if show is in the future
    if (new Date() >= show.dateTime.start) {
      return res.status(400).json({ error: 'Cannot book seats for past shows' });
    }

    // Get active reservations for this show
    const activeReservations = await SeatReservation.getActiveReservationsForShow(showId);
    
    // Create a set of reserved seats for quick lookup
    const reservedSeats = new Set();
    activeReservations.forEach(reservation => {
      reservation.seats.forEach(seat => {
        reservedSeats.add(`${seat.row}-${seat.seatNumber}`);
      });
    });

    // Check if requested seats are available
    const requestedSeats = new Set();
    const seatDetails = [];
    let totalAmount = 0;

    for (const seat of seats) {
      const seatKey = `${seat.row}-${seat.seatNumber}`;
      
      // Check for duplicates in request
      if (requestedSeats.has(seatKey)) {
        return res.status(400).json({ 
          error: `Duplicate seat: ${seat.row}${seat.seatNumber}` 
        });
      }
      requestedSeats.add(seatKey);

      // Check if seat is already reserved
      if (reservedSeats.has(seatKey)) {
        return res.status(400).json({ 
          error: `Seat ${seat.row}${seat.seatNumber} is temporarily reserved` 
        });
      }

      // Find seat in show layout and validate
      const rowLayout = show.seatLayout.layout.find(r => r.row === seat.row);
      if (!rowLayout) {
        return res.status(400).json({ 
          error: `Invalid row: ${seat.row}` 
        });
      }

      const seatInfo = rowLayout.seats.find(s => s.seatNumber === seat.seatNumber);
      if (!seatInfo) {
        return res.status(400).json({ 
          error: `Invalid seat: ${seat.row}${seat.seatNumber}` 
        });
      }

      if (seatInfo.status !== 'available') {
        return res.status(400).json({ 
          error: `Seat ${seat.row}${seat.seatNumber} is not available` 
        });
      }

      seatDetails.push({
        row: seat.row,
        seatNumber: seat.seatNumber,
        seatType: seatInfo.seatType,
        price: seatInfo.price
      });

      totalAmount += seatInfo.price;
    }

    // Check if user already has an active reservation for this show
    const existingReservation = await SeatReservation.findOne({
      show: showId,
      user: userId,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (existingReservation) {
      return res.status(400).json({ 
        error: 'You already have an active reservation for this show. Please complete your booking first.' 
      });
    }

    // Create the reservation
    const reservation = new SeatReservation({
      show: showId,
      user: userId,
      seats: seatDetails,
      totalAmount
    });

    await reservation.save();

    res.status(201).json({
      success: true,
      message: 'Seats reserved successfully',
      data: {
        reservationId: reservation._id,
        reservationCode: reservation.reservationCode,
        seats: reservation.seats,
        totalAmount: reservation.totalAmount,
        expiresAt: reservation.expiresAt,
        remainingTime: reservation.getRemainingTime()
      }
    });

  } catch (error) {
    console.error('Error reserving seats:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get reservation details
// @route   GET /api/reservations/:reservationId
// @access  Private
const getReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.user.id;

    const reservation = await SeatReservation.findById(reservationId)
      .populate('show', 'dateTime venue screen')
      .populate('user', 'name email');

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Check if user owns this reservation
    if (reservation.user._id.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to view this reservation' });
    }

    // Check if reservation is expired
    if (reservation.isExpired()) {
      return res.status(400).json({ 
        error: 'Reservation has expired',
        expired: true 
      });
    }

    res.json({
      success: true,
      data: {
        ...reservation.toObject(),
        remainingTime: reservation.getRemainingTime()
      }
    });

  } catch (error) {
    console.error('Error getting reservation:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Convert reservation to booking
// @route   POST /api/reservations/:reservationId/convert
// @access  Private
const convertToBooking = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.user.id;
    const { paymentMethod, customerDetails } = req.body;

    const reservation = await SeatReservation.findById(reservationId)
      .populate('show', 'dateTime venue screen movie event');

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Check if user owns this reservation
    if (reservation.user.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to convert this reservation' });
    }

    // Check if reservation is expired
    if (reservation.isExpired()) {
      return res.status(400).json({ 
        error: 'Reservation has expired. Please select seats again.' 
      });
    }

    // Check if reservation is already converted
    if (reservation.status === 'converted') {
      return res.status(400).json({ error: 'Reservation already converted to booking' });
    }

    // Create booking from reservation
    const booking = new Booking({
      user: userId,
      show: reservation.show._id,
      movie: reservation.show.movie,
      event: reservation.show.event,
      venue: reservation.show.venue,
      seats: reservation.seats,
      ticketCount: reservation.seats.length,
      totalAmount: reservation.totalAmount,
      paymentMethod,
      showDateTime: reservation.show.dateTime.start,
      customerDetails
    });

    await booking.save();

    // Update reservation status
    reservation.status = 'converted';
    reservation.convertedToBooking = booking._id;
    await reservation.save();

    res.json({
      success: true,
      message: 'Reservation converted to booking successfully',
      data: {
        bookingId: booking._id,
        bookingCode: booking.bookingCode,
        reservationId: reservation._id
      }
    });

  } catch (error) {
    console.error('Error converting reservation to booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Cancel reservation
// @route   DELETE /api/reservations/:reservationId
// @access  Private
const cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.user.id;

    const reservation = await SeatReservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Check if user owns this reservation
    if (reservation.user.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to cancel this reservation' });
    }

    // Check if reservation is already converted
    if (reservation.status === 'converted') {
      return res.status(400).json({ error: 'Cannot cancel a converted reservation' });
    }

    // Cancel the reservation
    reservation.status = 'cancelled';
    await reservation.save();

    res.json({
      success: true,
      message: 'Reservation cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get available seats for a show (excluding reserved seats)
// @route   GET /api/reservations/show/:showId/seats
// @access  Public
const getAvailableSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    // Check if show exists
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    // Get active reservations for this show
    const activeReservations = await SeatReservation.getActiveReservationsForShow(showId);
    
    // Create a set of reserved seats
    const reservedSeats = new Set();
    activeReservations.forEach(reservation => {
      reservation.seats.forEach(seat => {
        reservedSeats.add(`${seat.row}-${seat.seatNumber}`);
      });
    });

    // Filter available seats
    const availableSeats = show.seatLayout.layout.map(row => ({
      row: row.row,
      seats: row.seats.filter(seat => {
        const seatKey = `${row.row}-${seat.seatNumber}`;
        return seat.status === 'available' && !reservedSeats.has(seatKey);
      })
    }));

    res.json({
      success: true,
      data: {
        showId,
        availableSeats,
        totalAvailable: availableSeats.reduce((sum, row) => sum + row.seats.length, 0),
        totalSeats: show.totalSeats,
        reservedSeats: reservedSeats.size
      }
    });

  } catch (error) {
    console.error('Error getting available seats:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Clean expired reservations (admin only)
// @route   POST /api/reservations/clean-expired
// @access  Private (Admin)
const cleanExpiredReservations = async (req, res) => {
  try {
    const cleanedCount = await SeatReservation.cleanExpiredReservations();
    
    res.json({
      success: true,
      message: `Cleaned ${cleanedCount} expired reservations`,
      cleanedCount
    });

  } catch (error) {
    console.error('Error cleaning expired reservations:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  reserveSeats,
  getReservation,
  convertToBooking,
  cancelReservation,
  getAvailableSeats,
  cleanExpiredReservations
}; 