const Appointment = require('../models/appointment.model');
const Doctor = require('../models/doctor.model');
const User = require('../models/user.model');
const sendEmail = require('../utils/sendEmail');

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

    
    req.io.emit('slotBooked', { doctorId, date, time })

    
    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Appointment Confirmation - Medicare',
        message: `Your appointment with Dr. ${doctor.userId.name} is confirmed for ${date} at ${time}.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #2563eb; text-align: center;">Appointment Confirmed</h2>
            <p>Dear <strong>${req.user.name}</strong>,</p>
            <p>Your appointment has been successfully booked. Here are the details:</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. ${doctor.userId.name}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
            </div>
            <p>Please arrive 10 minutes before your scheduled time.</p>
            <p style="color: #64748b; font-size: 14px; margin-top: 30px; text-align: center;">
              Thank you for choosing Medicare Hospital.<br>
              <small>This is an automated message, please do not reply.</small>
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

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

    
    req.io.emit('slotCancelled', {
      doctorId: appointment.doctorId.toString(),
      date: appointment.date,
      time: appointment.time,
    });

    const doctor = await Doctor.findById(appointment.doctorId).populate('userId', 'name')

    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Appointment Cancelled - Medicare',
        message: `Your appointment with Dr. ${doctor.userId.name} for ${appointment.date} at ${appointment.time} has been cancelled.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #dc2626; text-align: center;">Appointment Cancelled</h2>
            <p>Dear <strong>${req.user.name}</strong>,</p>
            <p>Your appointment has been cancelled as requested.</p>
            <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. ${doctor.userId.name}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${appointment.date}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${appointment.time}</p>
            </div>
            <p>If you'd like to book another appointment, please visit our website.</p>
            <p style="color: #64748b; font-size: 14px; margin-top: 30px; text-align: center;">
              Thank you for choosing Medicare Hospital.<br>
              <small>This is an automated message, please do not reply.</small>
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
    }

    res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const rescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (appointment.status !== 'booked') {
      return res.status(400).json({ message: 'Only booked appointments can be rescheduled' });
    }
    
    const conflict = await Appointment.findOne({
      doctorId: appointment.doctorId,
      date,
      time,
      status: { $ne: 'cancelled' },
      _id: { $ne: appointment._id },
    });
    if (conflict) {
      return res.status(400).json({ message: 'This slot is already booked. Please choose another.' });
    }
    const oldDate = appointment.date;
    const oldTime = appointment.time;
    appointment.date = date;
    appointment.time = time;
    await appointment.save();

    
    req.io.emit('slotCancelled', { doctorId: appointment.doctorId.toString(), date: oldDate, time: oldTime });
    
    req.io.emit('slotBooked', { doctorId: appointment.doctorId.toString(), date, time });

    const doctor = await Doctor.findById(appointment.doctorId).populate('userId', 'name')

    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Appointment Rescheduled - Medicare',
        message: `Your appointment with Dr. ${doctor.userId.name} has been rescheduled to ${date} at ${time}.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #2563eb; text-align: center;">Appointment Rescheduled</h2>
            <p>Dear <strong>${req.user.name}</strong>,</p>
            <p>Your appointment has been successfully rescheduled. Here are the updated details:</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. ${doctor.userId.name}</p>
              <p style="margin: 5px 0;"><strong>New Date:</strong> ${date}</p>
              <p style="margin: 5px 0;"><strong>New Time:</strong> ${time}</p>
            </div>
            <p>Please arrive 10 minutes before your scheduled time.</p>
            <p style="color: #64748b; font-size: 14px; margin-top: 30px; text-align: center;">
              Thank you for choosing Medicare Hospital.<br>
              <small>This is an automated message, please do not reply.</small>
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send reschedule email:', emailError);
    }

    res.status(200).json({ message: 'Appointment rescheduled successfully', appointment });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
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
      status: { $in: ['booked', 'completed'] }
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
  rescheduleAppointment,
  getDoctorAppointments,
  completeAppointment,
  getAllAppointments,
};