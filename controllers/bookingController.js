const Booking = require('../models/Booking');
const Show = require('../models/Show');
const User = require('../models/User');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { 
      showId, 
      seats, 
      paymentMethod, 
      customerDetails,
      specialRequests 
    } = req.body;

    // Validate show exists and is active
    const show = await Show.findById(showId).populate('venue movie event');
    if (!show || !show.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Show not found or inactive'
      });
    }

    // Check if show is in the future
    if (new Date(show.dateTime.start) <= new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot book tickets for past shows'
      });
    }

    // Validate seats
    if (!seats || seats.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please select at least one seat'
      });
    }

    if (seats.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 seats per booking'
      });
    }

    // Check seat availability and lock seats
    const seatValidation = await validateAndLockSeats(show, seats);
    if (!seatValidation.success) {
      return res.status(400).json({
        success: false,
        error: seatValidation.error
      });
    }

    // Calculate total amount
    const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      show: showId,
      movie: show.movie,
      event: show.event,
      venue: show.venue._id,
      seats,
      ticketCount: seats.length,
      totalAmount,
      paymentMethod,
      showDateTime: show.dateTime.start,
      customerDetails: customerDetails || {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      },
      specialRequests
    });

    // Update show seat availability
    await updateShowSeats(show, seats, 'booked');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: {
          id: booking._id,
          bookingCode: booking.bookingCode,
          totalAmount: booking.totalAmount,
          status: booking.status,
          expiryDateTime: booking.expiryDateTime,
          seats: booking.seats
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('show venue movie event')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('show venue movie event user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('show');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'expired') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel expired booking'
      });
    }

    // Check if show is too close
    const showTime = new Date(booking.showDateTime);
    const now = new Date();
    const hoursUntilShow = (showTime - now) / (1000 * 60 * 60);

    if (hoursUntilShow < 2) {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel booking within 2 hours of show time'
      });
    }

    // Calculate refund
    const refundAmount = booking.calculateRefund();

    // Update booking
    booking.status = 'cancelled';
    booking.cancellationDateTime = new Date();
    booking.cancellationReason = reason;
    booking.refundAmount = refundAmount;
    await booking.save();

    // Release seats back to available
    if (booking.show) {
      await updateShowSeats(booking.show, booking.seats, 'available');
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        refundAmount,
        cancellationDateTime: booking.cancellationDateTime
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lock seats temporarily
// @route   POST /api/bookings/lock-seats
// @access  Private
const lockSeats = async (req, res, next) => {
  try {
    const { showId, seats } = req.body;

    const show = await Show.findById(showId);
    if (!show || !show.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Show not found or inactive'
      });
    }

    // Validate seats
    const seatValidation = await validateAndLockSeats(show, seats, 'lock');
    if (!seatValidation.success) {
      return res.status(400).json({
        success: false,
        error: seatValidation.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Seats locked successfully',
      data: {
        lockedSeats: seats,
        lockExpiry: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to validate and lock seats
const validateAndLockSeats = async (show, seats, action = 'book') => {
  try {
    for (const seat of seats) {
      const seatFound = show.seatLayout.layout
        .find(row => row.row === seat.row)
        ?.seats.find(s => s.seatNumber === seat.seatNumber);

      if (!seatFound) {
        return { success: false, error: `Seat ${seat.row}${seat.seatNumber} not found` };
      }

      if (seatFound.status !== 'available') {
        return { 
          success: false, 
          error: `Seat ${seat.row}${seat.seatNumber} is not available` 
        };
      }

      // Update seat status
      seatFound.status = action === 'book' ? 'booked' : 'locked';
    }

    await show.save();
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error validating seats' };
  }
};

// Helper function to update show seats
const updateShowSeats = async (show, seats, status) => {
  try {
    for (const seat of seats) {
      const seatFound = show.seatLayout.layout
        .find(row => row.row === seat.row)
        ?.seats.find(s => s.seatNumber === seat.seatNumber);

      if (seatFound) {
        seatFound.status = status;
      }
    }

    // Update seat counts
    if (status === 'booked') {
      show.bookedSeats += seats.length;
      show.availableSeats -= seats.length;
    } else if (status === 'available') {
      show.bookedSeats -= seats.length;
      show.availableSeats += seats.length;
    }

    await show.save();
  } catch (error) {
    console.error('Error updating show seats:', error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
  lockSeats
}; 