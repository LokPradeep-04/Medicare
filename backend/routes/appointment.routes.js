const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getDoctorAppointments,
  completeAppointment,
  getAllAppointments,
} = require('../controllers/appointment.controller');
const protect = require('../middlewares/auth.middleware');

// Patient routes
router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.patch('/:id/cancel', protect, cancelAppointment);

// Doctor routes
router.get('/doctor', protect, getDoctorAppointments);
router.patch('/:id/complete', protect, completeAppointment);

// Admin routes
router.get('/all', protect, getAllAppointments);

module.exports = router;