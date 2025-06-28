const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
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
  screen: {
    name: {
      type: String,
      required: [true, 'Please specify screen name']
    },
    screenType: {
      type: String,
      enum: ['2D', '3D', 'IMAX', '4DX', 'Dolby'],
      default: '2D'
    }
  },
  dateTime: {
    start: {
      type: Date,
      required: [true, 'Please add show start date and time']
    },
    end: {
      type: Date,
      required: [true, 'Please add show end date and time']
    }
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please add show duration']
  },
  pricing: [{
    seatType: {
      type: String,
      required: [true, 'Please specify seat type'],
      enum: ['premium', 'executive', 'economy', 'balcony', 'box', 'vip']
    },
    price: {
      type: Number,
      required: [true, 'Please add price']
    },
    currency: {
      type: String,
      default: 'INR'
    }
  }],
  seatLayout: {
    rows: {
      type: Number,
      required: [true, 'Please specify number of rows']
    },
    columns: {
      type: Number,
      required: [true, 'Please specify number of columns']
    },
    layout: [{
      row: {
        type: String,
        required: true
      },
      seats: [{
        seatNumber: {
          type: String,
          required: true
        },
        seatType: {
          type: String,
          enum: ['premium', 'executive', 'economy', 'balcony', 'box', 'vip'],
          default: 'economy'
        },
        status: {
          type: String,
          enum: ['available', 'booked', 'locked', 'blocked'],
          default: 'available'
        },
        price: {
          type: Number,
          required: true
        }
      }]
    }]
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please specify total seats']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Please specify available seats']
  },
  bookedSeats: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    required: [true, 'Please specify language']
  },
  subtitles: {
    type: String,
    default: 'None'
  },
  showType: {
    type: String,
    enum: ['movie', 'event'],
    required: [true, 'Please specify show type']
  },
  specialFeatures: [{
    type: String,
    enum: ['dolby-atmos', '4k', 'hdr', '3d-glasses', 'food-service', 'recliner-seats']
  }],
  cancellationPolicy: {
    type: String,
    maxlength: [500, 'Cancellation policy cannot be more than 500 characters']
  },
  terms: [String]
}, {
  timestamps: true
});

// Index for filtering
ShowSchema.index({ venue: 1, 'dateTime.start': 1 });
ShowSchema.index({ movie: 1, status: 1 });
ShowSchema.index({ event: 1, status: 1 });
ShowSchema.index({ status: 1, isActive: 1 });

// Virtual for show type validation
ShowSchema.pre('save', function(next) {
  if (this.showType === 'movie' && !this.movie) {
    return next(new Error('Movie is required for movie shows'));
  }
  if (this.showType === 'event' && !this.event) {
    return next(new Error('Event is required for event shows'));
  }
  next();
});

module.exports = mongoose.model('Show', ShowSchema); 