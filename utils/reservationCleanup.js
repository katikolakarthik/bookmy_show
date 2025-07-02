const SeatReservation = require('../models/SeatReservation');

// Start the cleanup job to remove expired reservations
const startCleanupJob = () => {
  // Run cleanup every 5 minutes
  setInterval(async () => {
    try {
      const cleanedCount = await SeatReservation.cleanExpiredReservations();
      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned ${cleanedCount} expired reservations`);
      }
    } catch (error) {
      console.error('Error in reservation cleanup job:', error);
    }
  }, 5 * 60 * 1000); // 5 minutes

  console.log('🔄 Reservation cleanup job started');
};

module.exports = {
  startCleanupJob
}; 