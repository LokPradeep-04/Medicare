const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Appointment = require('../models/appointment.model');

const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({ patients });
  } catch (error) {
    console.error('Error getting patients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const todayAppointments = await Appointment.countDocuments({
      date: today,
      status: 'booked'
    });

    res.status(200).json({
      totalDoctors,
      totalPatients,
      todayAppointments,
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllPatients, getStats };
