const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/top-5-cheap')
  .get(tourController.aliasTopTours, 
    tourController.getAllTours)

router.route('/tour-stats')
  .get(tourController.getTourStats);

router.route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan);


router
  .route('/')
  .get(authController.requireSignin, tourController.getAllTours)
  .post(tourController.createTour)

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.requireSignin, 
    authController.restrictTo('admin', 'tour-lead'), 
    tourController.deleteTour);

module.exports = router;
