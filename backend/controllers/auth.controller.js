const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  try {
    const { name, email, password, phone, age, gender } = req.body;

    if (!name || !email || !password || !phone || !age || !gender) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      age,
      gender,
      role: 'patient',
    });

    const token = generateToken(user._id);

    res.status(201).json({ message: "User Created", token: token });
  } catch (error) {
    
    if (error.code === 11000) {
      const dupField = Object.keys(error.keyPattern)[0];
      const msg = dupField === 'email' ? 'Email already exists' : dupField === 'phone' ? 'Phone number already exists' : 'Duplicate field';
      return res.status(400).json({ message: msg });
    }
    console.error('Error in registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login Successful",
      token: token,
      role: user.role
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMe = async (req, res) => {
  try {
    let userData = { ...req.user.toJSON() };
    if (userData.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) {
        userData.doctorInfo = doctor;
      }
    }
    res.status(200).json({ user: userData });
  } catch (error) {
    console.log('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, age, gender, specialization, experience, fees, availableSlots } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) {
      
      if (phone !== user.phone) {
        const phoneTaken = await User.findOne({ phone, _id: { $ne: user._id } });
        if (phoneTaken) {
          return res.status(400).json({ message: 'Phone number already exists' });
        }
      }
      user.phone = phone;
    }
    if (age) user.age = age;
    if (gender) user.gender = gender;

    await user.save();

    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: user._id });
      if (doctor) {
        if (specialization) doctor.specialization = specialization;
        if (experience) doctor.experience = experience;
        if (fees) doctor.fees = fees;
        if (availableSlots) doctor.availableSlots = availableSlots;
        await doctor.save();
      }
    }

    let userData = { ...user.toJSON() };
    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: user._id });
      if (doctor) {
        userData.doctorInfo = doctor;
      }
    }

    res.status(200).json({ message: 'Profile updated successfully', user: userData });
  } catch (error) {
    
    if (error.code === 11000) {
      const dupField = Object.keys(error.keyPattern)[0];
      const msg = dupField === 'email' ? 'Email already exists' : dupField === 'phone' ? 'Phone number already exists' : 'Duplicate field';
      return res.status(400).json({ message: msg });
    }
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { register, login, getMe, updateProfile };
