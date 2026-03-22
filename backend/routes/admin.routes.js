const express = require('express');
const router = express.Router();
const { getAllPatients, getStats } = require('../controllers/admin.controller');
const protect = require('../middlewares/auth.middleware');

router.get('/patients', protect, getAllPatients);
router.get('/stats', protect, getStats);

module.exports = router;