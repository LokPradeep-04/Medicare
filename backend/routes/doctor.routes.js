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
const admin = require('../middlewares/admin.middleware');

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/slots', getSlots);

router.post('/', protect, admin, addDoctor);
router.put('/:id', protect, admin, updateDoctor);
router.delete('/:id', protect, admin, deleteDoctor);

module.exports = router;