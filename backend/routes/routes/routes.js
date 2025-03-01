const models = require('../../models');

// Get all routes
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await models.Route.findAll();
    res.status(200).json({ success: true, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single route by ID
exports.getRouteById = async (req, res) => {
  try {
    const route = await models.Route.findByPk(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    res.status(200).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new route
exports.createRoute = async (req, res) => {
  try {
    const { userId, startLocation, endLocation, waypoints, travelTime } = req.body;
    const route = await models.Route.create({
      userId,
      startLocation,
      endLocation,
      waypoints,
      travelTime,
    });
    res.status(201).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a route by ID
exports.updateRoute = async (req, res) => {
  try {
    const { userId, startLocation, endLocation, waypoints, travelTime } = req.body;
    const route = await models.Route.findByPk(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    route.userId = userId;
    route.startLocation = startLocation;
    route.endLocation = endLocation;
    route.waypoints = waypoints;
    route.travelTime = travelTime;
    await route.save();
    res.status(200).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a route by ID
exports.deleteRoute = async (req, res) => {
  try {
    const route = await models.Route.findByPk(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    await route.destroy();
    res.status(204).json({ success: true, message: 'Route deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};