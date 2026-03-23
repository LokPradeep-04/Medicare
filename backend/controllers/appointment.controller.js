const Appointment = require('../models/appointment.model');
const Doctor = require('../models/doctor.model');
const User = require('../models/user.model');


const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body
    const patientId = req.user._id
    const doctor = await Doctor.findById(doctorId).populate('userId', 'name')
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }
    const existing = await Appointment.findOne({
      doctorId, date, time, status: { $ne: 'cancelled' }
    })
    if (existing) {
      return res.status(400).json({ message: 'This slot is already booked' })
    }
    const appointment = await Appointment.create({
      patientId, doctorId, date, time, status: 'booked',
    })

    res.status(201).json({ message: 'Appointment booked successfully', appointment })
  } catch (error) {
    console.error('Error booking appointment:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ date: -1 });
    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Error getting appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed appointment' });
    }
    appointment.status = 'cancelled';
    await appointment.save();
    res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    const today = new Date().toISOString().split('T')[0];
    const appointments = await Appointment.find({
      doctorId: doctor._id,
      date: today,
      status: 'booked'
    })
      .populate('patientId', 'name phone age gender')
      .sort({ time: 1 });
    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Error getting doctor appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    appointment.status = 'completed';
    await appointment.save();
    res.status(200).json({ message: 'Appointment marked as completed' });
  } catch (error) {
    console.error('Error completing appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email phone')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ date: -1 });
    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Error getting all appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getDoctorAppointments,
  completeAppointment,
  getAllAppointments,
};