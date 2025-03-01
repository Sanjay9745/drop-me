const models = require('../../models');

// Get all ride requests
exports.getAllRideRequests = async (req, res) => {
  try {
    const rideRequests = await models.RideRequest.findAll();
    res.status(200).json(rideRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single ride request by ID
exports.getRideRequestById = async (req, res) => {
  try {
    const rideRequest = await models.RideRequest.findByPk(req.params.id);
    if (!rideRequest) {
      return res.status(404).json({ message: 'Ride request not found' });
    }
    res.status(200).json(rideRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new ride request
exports.createRideRequest = async (req, res) => {
  try {
    const { userId, pickupLocation, dropoffLocation, status } = req.body;
    const rideRequest = await models.RideRequest.create({
      userId,
      pickupLocation,
      dropoffLocation,
      status,
    });
    res.status(201).json(rideRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a ride request by ID
exports.updateRideRequest = async (req, res) => {
  try {
    const { userId, pickupLocation, dropoffLocation, status } = req.body;
    const rideRequest = await models.RideRequest.findByPk(req.params.id);
    if (!rideRequest) {
      return res.status(404).json({ message: 'Ride request not found' });
    }
    rideRequest.userId = userId;
    rideRequest.pickupLocation = pickupLocation;
    rideRequest.dropoffLocation = dropoffLocation;
    rideRequest.status = status;
    await rideRequest.save();
    res.status(200).json(rideRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a ride request by ID
exports.deleteRideRequest = async (req, res) => {
  try {
    const rideRequest = await models.RideRequest.findByPk(req.params.id);
    if (!rideRequest) {
      return res.status(404).json({ message: 'Ride request not found' });
    }
    await rideRequest.destroy();
    res.status(204).json({ message: 'Ride request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};