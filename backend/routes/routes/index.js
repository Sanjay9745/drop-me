const express = require('express');
const router = express.Router();
const routesController = require('./routes');

// Define routes for routes
router.get('/daily-routes', routesController.getAllRoutes);
router.get('/:id', routesController.getRouteById);
router.post('/', routesController.createRoute);
router.put('/:id', routesController.updateRoute);
router.delete('/:id', routesController.deleteRoute);

module.exports = router;