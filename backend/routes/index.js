const express = require('express');
const router = express.Router();

// Import modular routes
const usersRoutes = require('./users');
const ridesRoutes = require('./rides');
const routesRoutes = require('./routes');
const rideRequestsRoutes = require('./ride-requests');
const rideAvailableRoutes = require('./ride-available');
const dailyRoutesRoutes = require('./daily-routes');

// Use modular routes
router.use('/users', usersRoutes);
router.use('/rides', ridesRoutes);
router.use('/routes', routesRoutes);
router.use('/ride-requests', rideRequestsRoutes);
router.use('/ride-available', rideAvailableRoutes);
router.use('/daily-routes', dailyRoutesRoutes);

module.exports = router;