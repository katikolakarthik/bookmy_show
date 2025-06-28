const Venue = require('../models/Venue');

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public
const getVenues = async (req, res, next) => {
  try {
    const { 
      city, 
      type, 
      page = 1, 
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Filter by city
    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const venues = await Venue.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Venue.countDocuments(query);

    res.status(200).json({
      success: true,
      count: venues.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: venues
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single venue
// @route   GET /api/venues/:id
// @access  Public
const getVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        error: 'Venue not found'
      });
    }

    res.status(200).json({
      success: true,
      data: venue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new venue
// @route   POST /api/venues
// @access  Private (Admin only)
const createVenue = async (req, res, next) => {
  try {
    const venue = await Venue.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Venue created successfully',
      data: venue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update venue
// @route   PUT /api/venues/:id
// @access  Private (Admin only)
const updateVenue = async (req, res, next) => {
  try {
    let venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        error: 'Venue not found'
      });
    }

    venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Venue updated successfully',
      data: venue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete venue
// @route   DELETE /api/venues/:id
// @access  Private (Admin only)
const deleteVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        error: 'Venue not found'
      });
    }

    // Soft delete - set isActive to false
    venue.isActive = false;
    await venue.save();

    res.status(200).json({
      success: true,
      message: 'Venue deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get venues by city
// @route   GET /api/venues/city/:city
// @access  Public
const getVenuesByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const venues = await Venue.find({
      'address.city': { $regex: city, $options: 'i' },
      isActive: true
    })
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Venue.countDocuments({
      'address.city': { $regex: city, $options: 'i' },
      isActive: true
    });

    res.status(200).json({
      success: true,
      count: venues.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: venues
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get venue types
// @route   GET /api/venues/types
// @access  Public
const getVenueTypes = async (req, res, next) => {
  try {
    const types = await Venue.distinct('type');
    
    res.status(200).json({
      success: true,
      data: types
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cities with venues
// @route   GET /api/venues/cities
// @access  Public
const getCities = async (req, res, next) => {
  try {
    const cities = await Venue.distinct('address.city');
    
    res.status(200).json({
      success: true,
      data: cities
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVenues,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue,
  getVenuesByCity,
  getVenueTypes,
  getCities
}; 