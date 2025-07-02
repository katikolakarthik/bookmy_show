const mongoose = require('mongoose');

const SeatReservationSchema = new mongoose.Schema({
  show: {
    type: mongoose.Schema.ObjectId,
    ref: 'Show',
    required: [true, 'Please specify show']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please specify user']
  },
  seats: [{
    row: {
      type: String,
      required: [true, 'Please specify seat row']
    },
    seatNumber: {
      type: String,
      required: [true, 'Please specify seat number']
    },
    seatType: {
      type: String,
      enum: ['premium', 'executive', 'economy', 'balcony', 'box', 'vip'],
      required: [true, 'Please specify seat type']
    },
    price: {
      type: Number,
      required: [true, 'Please specify seat price']
    }
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Please specify total amount']
  },
  reservationCode: {
    type: String,
    unique: true,
    required: [true, 'Reservation code is required']
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'converted', 'cancelled'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    required: [true, 'Please specify expiry time']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  convertedToBooking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking'
  }
}, {
  timestamps: true
});

// Indexes for performance
SeatReservationSchema.index({ show: 1, status: 1 });
SeatReservationSchema.index({ user: 1, status: 1 });
SeatReservationSchema.index({ reservationCode: 1 });
SeatReservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for automatic cleanup
SeatReservationSchema.index({ status: 1, expiresAt: 1 });

// Generate unique reservation code
SeatReservationSchema.pre('save', async function(next) {
  if (!this.reservationCode) {
    const { v4: uuidv4 } = require('uuid');
    this.reservationCode = `RS${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  
  // Set expiry time (5 minutes from creation)
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  }
  
  next();
});

// Method to check if reservation is expired
SeatReservationSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Method to get remaining time in seconds
SeatReservationSchema.methods.getRemainingTime = function() {
  const now = new Date();
  const remaining = Math.max(0, Math.floor((this.expiresAt - now) / 1000));
  return remaining;
};

// Static method to clean expired reservations
SeatReservationSchema.statics.cleanExpiredReservations = async function() {
  try {
    const result = await this.updateMany(
      { 
        status: 'active', 
        expiresAt: { $lt: new Date() } 
      },
      { 
        status: 'expired' 
      }
    );
    console.log(`Cleaned ${result.modifiedCount} expired reservations`);
    return result.modifiedCount;
  } catch (error) {
    console.error('Error cleaning expired reservations:', error);
    throw error;
  }
};

// Static method to get active reservations for a show
SeatReservationSchema.statics.getActiveReservationsForShow = async function(showId) {
  try {
    const reservations = await this.find({
      show: showId,
      status: 'active',
      expiresAt: { $gt: new Date() }
    }).populate('user', 'name email');
    
    return reservations;
  } catch (error) {
    console.error('Error getting active reservations:', error);
    throw error;
  }
};

module.exports = mongoose.model('SeatReservation', SeatReservationSchema); 