const User = require('../models/User');
const Movie = require('../models/Movie');
const Event = require('../models/Event');
const Venue = require('../models/Venue');
const Booking = require('../models/Booking');
const Show = require('../models/Show');

// @desc    Create admin user
// @route   POST /api/auth/create-admin
// @access  Public (with secret)
const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone, adminSecret } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Admin user already exists'
      });
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      phone,
      role: 'admin'
    });

    // Create token
    const token = admin.getSignedJwtToken();

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          role: admin.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalMovies,
      totalEvents,
      totalVenues,
      totalBookings,
      totalShows,
      activeUsers,
      activeMovies,
      activeEvents,
      recentBookings
    ] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Event.countDocuments(),
      Venue.countDocuments(),
      Booking.countDocuments(),
      Show.countDocuments(),
      User.countDocuments({ isActive: true }),
      Movie.countDocuments({ isActive: true, status: 'now-showing' }),
      Event.countDocuments({ isActive: true, status: 'upcoming' }),
      Booking.find({ status: 'confirmed' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .populate('movie', 'title')
        .populate('event', 'title')
    ]);

    // Calculate revenue
    const revenueData = await Booking.aggregate([
      { $match: { status: 'confirmed', paymentStatus: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Monthly revenue for last 6 months
    const monthlyRevenue = await Booking.aggregate([
      { 
        $match: { 
          status: 'confirmed', 
          paymentStatus: 'completed',
          createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalMovies,
          totalEvents,
          totalVenues,
          totalBookings,
          totalShows,
          activeUsers,
          activeMovies,
          activeEvents,
          totalRevenue
        },
        recentBookings,
        monthlyRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role, isActive } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (user.role === 'admin' && req.user.id === userId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot deactivate your own admin account'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
const getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('movie', 'title')
      .populate('event', 'title')
      .populate('venue', 'name')
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

module.exports = {
  createAdmin,
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllBookings
}; 