const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.patch('/profile', authMiddleware, updateProfile);

module.exports = router;

