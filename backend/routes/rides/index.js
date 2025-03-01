const express = require('express');
const router = express.Router();
const ridesController = require('./rides');

// Define routes for rides
router.get('/', ridesController.getAllRides);
router.get('/:id', ridesController.getRideById);
router.post('/', ridesController.createRide);
router.put('/:id', ridesController.updateRide);
router.delete('/:id', ridesController.deleteRide);

module.exports = router;