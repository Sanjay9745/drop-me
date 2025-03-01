const express = require('express');
const router = express.Router();
const dailyRoutesController = require('./daily-routes');
const userAuth = require('../../middlewares/userAuth');

// Define routes for daily routes
router.get('/', userAuth,dailyRoutesController.getAllDailyRoutes);
router.get('/:id',userAuth, dailyRoutesController.getDailyRouteById);
router.post('/',userAuth, dailyRoutesController.createDailyRoute);
router.put('/:id', dailyRoutesController.updateDailyRoute);
router.delete('/:id', dailyRoutesController.deleteDailyRoute);

module.exports = router;