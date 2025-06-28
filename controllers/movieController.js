const Movie = require('../models/Movie');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res, next) => {
  try {
    const { 
      search, 
      genre, 
      language, 
      status, 
      year, 
      page = 1, 
      limit = 10,
      sortBy = 'releaseDate',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by genre
    if (genre) {
      query.genre = { $in: Array.isArray(genre) ? genre : [genre] };
    }

    // Filter by language
    if (language) {
      query.language = { $in: Array.isArray(language) ? language : [language] };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by year
    if (year) {
      query.year = parseInt(year);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const movies = await Movie.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Movie.countDocuments(query);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
const getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private (Admin only)
const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private (Admin only)
const updateMovie = async (req, res, next) => {
  try {
    let movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private (Admin only)
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    // Soft delete - set isActive to false
    movie.isActive = false;
    await movie.save();

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get movies by city (showing in theaters)
// @route   GET /api/movies/city/:city
// @access  Public
const getMoviesByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // This would typically involve joining with Show and Venue collections
    // For now, we'll return all active movies
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const movies = await Movie.find({ 
      isActive: true, 
      status: { $in: ['now-showing', 'upcoming'] } 
    })
      .sort({ releaseDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Movie.countDocuments({ 
      isActive: true, 
      status: { $in: ['now-showing', 'upcoming'] } 
    });

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get movie genres
// @route   GET /api/movies/genres
// @access  Public
const getGenres = async (req, res, next) => {
  try {
    const genres = await Movie.distinct('genre');
    
    res.status(200).json({
      success: true,
      data: genres
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get movie languages
// @route   GET /api/movies/languages
// @access  Public
const getLanguages = async (req, res, next) => {
  try {
    const languages = await Movie.distinct('language');
    
    res.status(200).json({
      success: true,
      data: languages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate a movie
// @route   POST /api/movies/:id/rate
// @access  Private
const rateMovie = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    // Update movie rating
    const currentTotal = movie.rating.userRating.average * movie.rating.userRating.count;
    const newCount = movie.rating.userRating.count + 1;
    const newAverage = (currentTotal + rating) / newCount;

    movie.rating.userRating.average = newAverage;
    movie.rating.userRating.count = newCount;
    await movie.save();

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        averageRating: newAverage,
        totalRatings: newCount
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesByCity,
  getGenres,
  getLanguages,
  rateMovie
}; 