const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const fixIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Drop existing text indexes
    console.log('🗑️ Dropping existing text indexes...');
    
    try {
      await db.collection('movies').dropIndex('title_text_description_text_genre_text');
      console.log('✅ Dropped movies text index');
    } catch (e) {
      console.log('ℹ️ Movies text index not found or already dropped');
    }

    try {
      await db.collection('events').dropIndex('title_text_description_text_type_text');
      console.log('✅ Dropped events text index');
    } catch (e) {
      console.log('ℹ️ Events text index not found or already dropped');
    }

    // Recreate indexes
    console.log('🔧 Recreating indexes...');
    
    // Movies indexes
    await db.collection('movies').createIndex({ title: 'text', description: 'text' });
    await db.collection('movies').createIndex({ status: 1, releaseDate: -1 });
    await db.collection('movies').createIndex({ genre: 1 });
    await db.collection('movies').createIndex({ language: 1 });
    console.log('✅ Recreated movies indexes');

    // Events indexes
    await db.collection('events').createIndex({ title: 'text', description: 'text' });
    await db.collection('events').createIndex({ status: 1, 'dateTime.start': 1 });
    await db.collection('events').createIndex({ type: 1, category: 1 });
    await db.collection('events').createIndex({ venue: 1 });
    await db.collection('events').createIndex({ featured: 1 });
    console.log('✅ Recreated events indexes');

    // Venues indexes
    await db.collection('venues').createIndex({ location: '2dsphere' });
    await db.collection('venues').createIndex({ 'address.city': 1 });
    console.log('✅ Recreated venues indexes');

    // Users indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('✅ Recreated users indexes');

    // Bookings indexes
    await db.collection('bookings').createIndex({ user: 1, createdAt: -1 });
    await db.collection('bookings').createIndex({ show: 1, status: 1 });
    await db.collection('bookings').createIndex({ bookingCode: 1 });
    await db.collection('bookings').createIndex({ status: 1, paymentStatus: 1 });
    await db.collection('bookings').createIndex({ 'showDateTime': 1, status: 1 });
    console.log('✅ Recreated bookings indexes');

    // Shows indexes
    await db.collection('shows').createIndex({ venue: 1, 'dateTime.start': 1 });
    await db.collection('shows').createIndex({ movie: 1, status: 1 });
    await db.collection('shows').createIndex({ event: 1, status: 1 });
    await db.collection('shows').createIndex({ status: 1, isActive: 1 });
    console.log('✅ Recreated shows indexes');

    console.log('\n🎉 All indexes fixed successfully!');
    console.log('🚀 You can now add movies without errors');

  } catch (error) {
    console.error('❌ Error fixing indexes:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run if this file is executed directly
if (require.main === module) {
  fixIndexes();
}

module.exports = fixIndexes; 