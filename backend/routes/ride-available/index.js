const express = require('express');
const router = express.Router();
const rideAvailableController = require('./ride-available');

// Define routes for available rides
router.get('/', rideAvailableController.getAllRideAvailable);
router.get('/:id', rideAvailableController.getRideAvailableById);
router.post('/', rideAvailableController.createRideAvailable);
router.put('/:id', rideAvailableController.updateRideAvailable);
router.delete('/:id', rideAvailableController.deleteRideAvailable);

module.exports = router;