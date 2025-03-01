const models = require('../../models');

// Get all available rides
exports.getAllRideAvailable = async (req, res) => {
  try {
    const rideAvailable = await models.RideAvailable.findAll();
    res.status(200).json(rideAvailable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single available ride by ID
exports.getRideAvailableById = async (req, res) => {
  try {
    const rideAvailable = await models.RideAvailable.findByPk(req.params.id);
    if (!rideAvailable) {
      return res.status(404).json({ message: 'Available ride not found' });
    }
    res.status(200).json(rideAvailable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new available ride
exports.createRideAvailable = async (req, res) => {
  try {
    const { userId, startLocation, endLocation, travelTime } = req.body;
    const rideAvailable = await models.RideAvailable.create({
      userId,
      startLocation,
      endLocation,
      travelTime,
    });
    res.status(201).json(rideAvailable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an available ride by ID
exports.updateRideAvailable = async (req, res) => {
  try {
    const { userId, startLocation, endLocation, travelTime } = req.body;
    const rideAvailable = await models.RideAvailable.findByPk(req.params.id);
    if (!rideAvailable) {
      return res.status(404).json({ message: 'Available ride not found' });
    }
    rideAvailable.userId = userId;
    rideAvailable.startLocation = startLocation;
    rideAvailable.endLocation = endLocation;
    rideAvailable.travelTime = travelTime;
    await rideAvailable.save();
    res.status(200).json(rideAvailable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an available ride by ID
exports.deleteRideAvailable = async (req, res) => {
  try {
    const rideAvailable = await models.RideAvailable.findByPk(req.params.id);
    if (!rideAvailable) {
      return res.status(404).json({ message: 'Available ride not found' });
    }
    await rideAvailable.destroy();
    res.status(204).json({ message: 'Available ride deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};