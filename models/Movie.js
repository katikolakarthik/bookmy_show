const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a movie title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  originalTitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  duration: {
    type: Number,
    required: [true, 'Please add movie duration in minutes']
  },
  releaseDate: {
    type: Date,
    required: [true, 'Please add release date']
  },
  director: {
    type: String,
    required: [true, 'Please add director name']
  },
  cast: [{
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'Actor'
    }
  }],
  crew: [{
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ['Producer', 'Writer', 'Cinematographer', 'Editor', 'Music Director', 'Costume Designer']
    }
  }],
  poster: {
    type: String,
    required: [true, 'Please add poster image URL']
  },
  banner: {
    type: String
  },
  trailer: {
    type: String
  },
  rating: {
    censorBoard: {
      type: String,
      enum: ['U', 'UA', 'A', 'S'],
      required: [true, 'Please add censor board rating']
    },
    imdb: {
      type: Number,
      min: 0,
      max: 10
    },
    userRating: {
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
  },
  status: {
    type: String,
    enum: ['upcoming', 'now-showing', 'ended'],
    default: 'upcoming'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  awards: [String],
  boxOffice: {
    budget: Number,
    collection: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  streamingPlatforms: [String],
  productionHouse: {
    type: String,
    required: [true, 'Please add production house']
  },
  country: {
    type: String,
    default: 'India'
  },
  year: {
    type: Number,
    required: [true, 'Please add release year']
  }
}, {
  timestamps: true
});

// Simple text index (no options)
MovieSchema.index({ title: 'text', description: 'text' });

// Index for filtering
MovieSchema.index({ status: 1, releaseDate: -1 });

module.exports = mongoose.model('Movie', MovieSchema); 