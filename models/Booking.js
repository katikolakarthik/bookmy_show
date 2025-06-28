const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please specify user']
  },
  show: {
    type: mongoose.Schema.ObjectId,
    ref: 'Show',
    required: [true, 'Please specify show']
  },
  movie: {
    type: mongoose.Schema.ObjectId,
    ref: 'Movie'
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event'
  },
  venue: {
    type: mongoose.Schema.ObjectId,
    ref: 'Venue',
    required: [true, 'Please specify venue']
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
  ticketCount: {
    type: Number,
    required: [true, 'Please specify number of tickets'],
    min: [1, 'At least 1 ticket required'],
    max: [10, 'Maximum 10 tickets per booking']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please specify total amount']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  bookingCode: {
    type: String,
    unique: true,
    required: [true, 'Booking code is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'expired', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'debit-card', 'upi', 'net-banking', 'wallet', 'cash'],
    required: [true, 'Please specify payment method']
  },
  paymentDetails: {
    transactionId: String,
    gateway: String,
    amount: Number,
    currency: String,
    timestamp: Date
  },
  showDateTime: {
    type: Date,
    required: [true, 'Please specify show date and time']
  },
  bookingDateTime: {
    type: Date,
    default: Date.now
  },
  expiryDateTime: {
    type: Date,
    required: [true, 'Please specify booking expiry time']
  },
  cancellationDateTime: Date,
  refundAmount: {
    type: Number,
    default: 0
  },
  cancellationReason: String,
  customerDetails: {
    name: {
      type: String,
      required: [true, 'Please specify customer name']
    },
    email: {
      type: String,
      required: [true, 'Please specify customer email']
    },
    phone: {
      type: String,
      required: [true, 'Please specify customer phone']
    }
  },
  specialRequests: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  notes: String
}, {
  timestamps: true
});

// Index for filtering
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ show: 1, status: 1 });
BookingSchema.index({ bookingCode: 1 });
BookingSchema.index({ status: 1, paymentStatus: 1 });
BookingSchema.index({ 'showDateTime': 1, status: 1 });

// Generate unique booking code
BookingSchema.pre('save', async function(next) {
  if (!this.bookingCode) {
    const { v4: uuidv4 } = require('uuid');
    this.bookingCode = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  
  // Set expiry time (15 minutes from booking)
  if (!this.expiryDateTime) {
    this.expiryDateTime = new Date(Date.now() + 15 * 60 * 1000);
  }
  
  next();
});

// Virtual for booking type
BookingSchema.virtual('bookingType').get(function() {
  return this.movie ? 'movie' : 'event';
});

// Method to check if booking is expired
BookingSchema.methods.isExpired = function() {
  return new Date() > this.expiryDateTime;
};

// Method to calculate refund amount
BookingSchema.methods.calculateRefund = function() {
  const now = new Date();
  const showTime = new Date(this.showDateTime);
  const hoursUntilShow = (showTime - now) / (1000 * 60 * 60);
  
  if (hoursUntilShow > 24) {
    return this.totalAmount * 0.8; // 80% refund if more than 24 hours
  } else if (hoursUntilShow > 2) {
    return this.totalAmount * 0.5; // 50% refund if more than 2 hours
  } else {
    return 0; // No refund if less than 2 hours
  }
};

module.exports = mongoose.model('Booking', BookingSchema); 