const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Appointment = require('../models/appointment.model');

const addDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, department, experience, fees, availableSlots, age, gender } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, email, password: hashedPassword, phone, role: 'doctor', age, gender
    });

    const doctor = await Doctor.create({
      userId: user._id, specialization, department, experience, fees, availableSlots,
    });

    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    
    const total = await Doctor.countDocuments();
    const doctors = await Doctor.find()
      .populate('userId', 'name email phone')
      .skip(skip)
      .limit(limit);

    res.status(200).json({ doctors, total, page, limit });
  } catch (error) {
    console.error('Error getting doctors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email phone');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json({ doctor });
  } catch (error) {
    console.error('Error getting doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { specialization, department, experience, fees, availableSlots } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { specialization, department, experience, fees, availableSlots },
      { new: true }
    );
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json({ message: 'Doctor updated', doctor });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    await User.findByIdAndDelete(doctor.userId);
    await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSlots = async (req, res) => {
  try {
    const { date } = req.query;
    const doctorId = req.params.id;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const daySlots = doctor.availableSlots.find(s => s.day === dayName);
    const allSlots = daySlots ? daySlots.slots : [];

    const booked = await Appointment.find({
      doctorId, date, status: { $ne: 'cancelled' }
    }).select('time');

    const bookedTimes = booked.map(a => a.time);
    const freeSlots = allSlots.filter(s => !bookedTimes.includes(s));

    res.status(200).json({ freeSlots });
  } catch (error) {
    console.error('Error getting slots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getSlots,
};