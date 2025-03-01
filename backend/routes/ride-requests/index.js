const express = require('express');
const router = express.Router();
const rideRequestsController = require('./ride-requests');

// Define routes for ride requests
router.get('/', rideRequestsController.getAllRideRequests);
router.get('/:id', rideRequestsController.getRideRequestById);
router.post('/', rideRequestsController.createRideRequest);
router.put('/:id', rideRequestsController.updateRideRequest);
router.delete('/:id', rideRequestsController.deleteRideRequest);

module.exports = router;