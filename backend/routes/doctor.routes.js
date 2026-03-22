const express = require('express');
const router = express.Router();
const {
  addDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getSlots,
} = require('../controllers/doctor.controller');
const protect = require('../middlewares/auth.middleware');

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/slots', getSlots);

// Protected routes (admin only)
router.post('/', protect, addDoctor);
router.put('/:id', protect, updateDoctor);
router.delete('/:id', protect, deleteDoctor);

module.exports = router;