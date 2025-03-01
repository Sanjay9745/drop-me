const models = require('../../models');

// Get all rides
exports.getAllRides = async (req, res) => {
  try {
    const rides = await models.Ride.findAll();
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single ride by ID
exports.getRideById = async (req, res) => {
  try {
    const ride = await models.Ride.findByPk(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new ride
exports.createRide = async (req, res) => {
  try {
    const { userId, pickupLocation, dropoffLocation, fare } = req.body;
    const ride = await models.Ride.create({
      userId,
      pickupLocation,
      dropoffLocation,
      fare,
    });
    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a ride by ID
exports.updateRide = async (req, res) => {
  try {
    const { userId, pickupLocation, dropoffLocation, fare } = req.body;
    const ride = await models.Ride.findByPk(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    ride.userId = userId;
    ride.pickupLocation = pickupLocation;
    ride.dropoffLocation = dropoffLocation;
    ride.fare = fare;
    await ride.save();
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a ride by ID
exports.deleteRide = async (req, res) => {
  try {
    const ride = await models.Ride.findByPk(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    await ride.destroy();
    res.status(204).json({ message: 'Ride deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};