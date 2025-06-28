const mongoose = require('mongoose');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Venue = require('./models/Venue');
require('dotenv').config({ path: './config.env' });

// Sample data
const sampleMovies = [
  {
    title: "Avengers: Endgame",
    description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    genre: ["action", "adventure", "sci-fi"],
    language: ["english"],
    duration: 181,
    releaseDate: "2019-04-26",
    director: "Anthony Russo",
    cast: [
      { name: "Robert Downey Jr.", role: "Iron Man" },
      { name: "Chris Evans", role: "Captain America" },
      { name: "Mark Ruffalo", role: "Hulk" }
    ],
    poster: "https://example.com/avengers-poster.jpg",
    rating: {
      censorBoard: "UA",
      imdb: 8.4
    },
    productionHouse: "Marvel Studios",
    year: 2019,
    status: "now-showing"
  },
  {
    title: "Joker",
    description: "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.",
    genre: ["crime", "drama", "thriller"],
    language: ["english"],
    duration: 122,
    releaseDate: "2019-10-04",
    director: "Todd Phillips",
    cast: [
      { name: "Joaquin Phoenix", role: "Arthur Fleck / Joker" },
      { name: "Robert De Niro", role: "Murray Franklin" }
    ],
    poster: "https://example.com/joker-poster.jpg",
    rating: {
      censorBoard: "A",
      imdb: 8.4
    },
    productionHouse: "Warner Bros. Pictures",
    year: 2019,
    status: "now-showing"
  }
];

const sampleVenues = [
  {
    name: "PVR Cinemas - Phoenix Mall",
    type: "theater",
    address: {
      street: "Phoenix Market City, LBS Marg",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400070",
      country: "India"
    },
    location: {
      type: "Point",
      coordinates: [72.8777, 19.0760]
    },
    capacity: 500,
    screens: [
      {
        name: "Screen 1",
        capacity: 150,
        screenType: "2D"
      },
      {
        name: "Screen 2",
        capacity: 120,
        screenType: "3D"
      }
    ],
    amenities: ["parking", "food-court", "ac", "wifi"],
    contactInfo: {
      phone: "022-12345678",
      email: "info@pvrphoenix.com"
    },
    operatingHours: {
      open: "09:00",
      close: "23:00"
    }
  },
  {
    name: "INOX - R City Mall",
    type: "theater",
    address: {
      street: "R City Mall, LBS Marg",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400070",
      country: "India"
    },
    location: {
      type: "Point",
      coordinates: [72.8777, 19.0760]
    },
    capacity: 400,
    screens: [
      {
        name: "Screen 1",
        capacity: 100,
        screenType: "2D"
      },
      {
        name: "Screen 2",
        capacity: 80,
        screenType: "3D"
      }
    ],
    amenities: ["parking", "food-court", "ac"],
    contactInfo: {
      phone: "022-87654321",
      email: "info@inoxrcity.com"
    },
    operatingHours: {
      open: "10:00",
      close: "23:30"
    }
  }
];

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Venue.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@bookmyshow.com',
      password: 'Admin123!',
      phone: '9876543210',
      role: 'admin'
    });
    console.log('👤 Created admin user:', adminUser.email);

    // Create sample movies
    const movies = await Movie.create(sampleMovies);
    console.log('🎬 Created', movies.length, 'sample movies');

    // Create sample venues
    const venues = await Venue.create(sampleVenues);
    console.log('🏢 Created', venues.length, 'sample venues');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Sample Data:');
    console.log('- Admin User: admin@bookmyshow.com / Admin123!');
    console.log('- Movies:', movies.length);
    console.log('- Venues:', venues.length);
    console.log('\n🚀 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 