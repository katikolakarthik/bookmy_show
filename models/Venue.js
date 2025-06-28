const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a venue name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify venue type'],
    enum: ['theater', 'auditorium', 'stadium', 'conference-hall', 'outdoor']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please add street address']
    },
    city: {
      type: String,
      required: [true, 'Please add city']
    },
    state: {
      type: String,
      required: [true, 'Please add state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please add zip code']
    },
    country: {
      type: String,
      required: [true, 'Please add country'],
      default: 'India'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  capacity: {
    type: Number,
    required: [true, 'Please add venue capacity']
  },
  screens: [{
    name: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    screenType: {
      type: String,
      enum: ['2D', '3D', 'IMAX', '4DX', 'Dolby'],
      default: '2D'
    },
    amenities: [String]
  }],
  amenities: [{
    type: String,
    enum: ['parking', 'food-court', 'wheelchair-access', 'ac', 'wifi', 'escalator', 'elevator']
  }],
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Please add contact phone']
    },
    email: {
      type: String,
      required: [true, 'Please add contact email']
    },
    website: String
  },
  operatingHours: {
    open: {
      type: String,
      default: '09:00'
    },
    close: {
      type: String,
      default: '23:00'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  images: [String],
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
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
  }
}, {
  timestamps: true
});

// Index for geospatial queries
VenueSchema.index({ location: '2dsphere' });

// Index for city-based searches
VenueSchema.index({ 'address.city': 1 });

module.exports = mongoose.model('Venue', VenueSchema); 