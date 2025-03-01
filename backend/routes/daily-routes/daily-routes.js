const db = require('../../models');

// Get all daily routes
exports.getAllDailyRoutes = async (req, res) => {
  try {
    const dailyRoutes = await db.DailyRoute.findAll({
      userId: req.user.userId,
    });
    res.status(200).json({ success: true, results: dailyRoutes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single daily route by ID
exports.getDailyRouteById = async (req, res) => {
  try {
    const dailyRoute = await db.DailyRoute.findByPk(req.params.id);
    if (!dailyRoute) {
      return res.status(404).json({ success: false, message: 'Daily route not found' });
    }
    res.status(200).json({ success: true, result: dailyRoute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new daily route
exports.createDailyRoute = async (req, res) => {
  try {
    const { start, end, middle, fromDateTime, toDateTime, distance, duration } = req.body;

    // Validate required fields
    if (!start || !end || !distance || !duration) {
      return res.status(400).json({ success: false, message: 'Missing required fields: start, end, distance, or duration' });
    }

    // Create the daily route in the database
    const dailyRoute = await db.DailyRoute.create({
      userId: req.user.userId, // Assuming you have user authentication and `req.user` is available
      startLocation: start,
      endLocation: end,
      middleLocations: middle, // Save middle markers as an array
      fromDateTime: fromDateTime || null, // Optional field
      toDateTime: toDateTime || null, // Optional field
      distance,
      duration,
    });

    // Respond with the created route
    res.status(201).json({ success: true, result: dailyRoute });
  } catch (error) {
    console.error('Error creating daily route:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a daily route by ID
exports.updateDailyRoute = async (req, res) => {
  try {
    const { userId, startLocation, endLocation, travelTime, isRecurring } = req.body;
    const dailyRoute = await db.DailyRoute.findByPk(req.params.id);
    if (!dailyRoute) {
      return res.status(404).json({ success: false, message: 'Daily route not found' });
    }
    dailyRoute.userId = userId;
    dailyRoute.startLocation = startLocation;
    dailyRoute.endLocation = endLocation;
    dailyRoute.travelTime = travelTime;
    dailyRoute.isRecurring = isRecurring;
    await dailyRoute.save();
    res.status(200).json({ success: true, result: dailyRoute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a daily route by ID
exports.deleteDailyRoute = async (req, res) => {
  try {
    const dailyRoute = await db.DailyRoute.findByPk(req.params.id);
    if (!dailyRoute) {
      return res.status(404).json({ success: false, message: 'Daily route not found' });
    }
    await dailyRoute.destroy();
    res.status(204).json({ success: true, message: 'Daily route deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};