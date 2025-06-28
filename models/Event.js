const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify event type'],
    enum: ['concert', 'play', 'comedy', 'dance', 'sports', 'conference', 'workshop', 'exhibition', 'festival', 'other']
  },
  category: {
    type: String,
    required: [true, 'Please add event category'],
    enum: ['entertainment', 'sports', 'business', 'education', 'cultural', 'religious', 'social']
  },
  organizer: {
    name: {
      type: String,
      required: [true, 'Please add organizer name']
    },
    email: {
      type: String,
      required: [true, 'Please add organizer email']
    },
    phone: {
      type: String,
      required: [true, 'Please add organizer phone']
    },
    website: String
  },
  venue: {
    type: mongoose.Schema.ObjectId,
    ref: 'Venue',
    required: [true, 'Please specify venue']
  },
  dateTime: {
    start: {
      type: Date,
      required: [true, 'Please add event start date and time']
    },
    end: {
      type: Date,
      required: [true, 'Please add event end date and time']
    }
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please add event duration']
  },
  performers: [{
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'Performer'
    },
    bio: String
  }],
  images: [String],
  poster: {
    type: String,
    required: [true, 'Please add poster image URL']
  },
  banner: String,
  video: String,
  tags: [String],
  ageRestriction: {
    type: String,
    enum: ['all-ages', '13+', '16+', '18+', '21+'],
    default: 'all-ages'
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  pricing: {
    type: String,
    enum: ['free', 'paid', 'donation'],
    default: 'paid'
  },
  ticketTypes: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    quantity: {
      type: Number,
      required: true
    },
    sold: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  amenities: [{
    type: String,
    enum: ['parking', 'food', 'beverages', 'wheelchair-access', 'wifi', 'photography-allowed', 'recording-allowed']
  }],
  terms: [String],
  cancellationPolicy: {
    type: String,
    maxlength: [500, 'Cancellation policy cannot be more than 500 characters']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search functionality (removed type from text index)
EventSchema.index({ title: 'text', description: 'text' });

// Index for filtering
EventSchema.index({ status: 1, 'dateTime.start': 1 });
EventSchema.index({ type: 1, category: 1 });
EventSchema.index({ venue: 1 });
EventSchema.index({ featured: 1 });

module.exports = mongoose.model('Event', EventSchema); 