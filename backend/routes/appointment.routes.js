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

router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.patch('/:id/cancel', protect, cancelAppointment);

router.get('/doctor', protect, getDoctorAppointments);
router.patch('/:id/complete', protect, completeAppointment);

router.get('/all', protect, getAllAppointments);

module.exports = router;