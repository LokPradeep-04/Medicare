require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');
const Doctor = require('./models/doctor.model');
const Appointment = require('./models/appointment.model');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('MongoDB Connected');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@medicare.com',
      password: adminPassword,
      phone: '9000000001',
      age: 35,
      gender: 'male',
      role: 'admin',
    });
    console.log('Admin created → admin@medicare.com / admin123');

    // Create Patient
    const patientPassword = await bcrypt.hash('patient123', 10);
    const patient = await User.create({
      name: 'Arjun Patel',
      email: 'arjun@gmail.com',
      password: patientPassword,
      phone: '9000000002',
      age: 28,
      gender: 'male',
      role: 'patient',
    });
    console.log('Patient created → arjun@gmail.com / patient123');

    // Create Doctors
    const doctorsData = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@medicare.com',
        phone: '9000000003',
        age: 45,
        gender: 'male',
        specialization: 'Cardiologist',
        department: 'Cardiology',
        experience: 12,
        fees: 800,
      },
      {
        name: 'Priya Sharma',
        email: 'priya@medicare.com',
        phone: '9000000004',
        age: 38,
        gender: 'female',
        specialization: 'Neurologist',
        department: 'Neurology',
        experience: 8,
        fees: 700,
      },
      {
        name: 'Anita Mehta',
        email: 'anita@medicare.com',
        phone: '9000000005',
        age: 42,
        gender: 'female',
        specialization: 'General Physician',
        department: 'General Medicine',
        experience: 15,
        fees: 500,
      },
      {
        name: 'Vikram Rao',
        email: 'vikram@medicare.com',
        phone: '9000000006',
        age: 50,
        gender: 'male',
        specialization: 'Orthopedic Surgeon',
        department: 'Orthopedics',
        experience: 20,
        fees: 900,
      },
    ];

    const availableSlots = [
      { day: 'Monday', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] },
      { day: 'Tuesday', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] },
      { day: 'Wednesday', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] },
      { day: 'Thursday', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] },
      { day: 'Friday', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] },
      { day: 'Saturday', slots: ['09:00', '09:30', '10:00', '10:30', '11:00'] },
    ];

    const doctorPassword = await bcrypt.hash('doctor123', 10);

    for (const d of doctorsData) {
      const user = await User.create({
        name: d.name,
        email: d.email,
        password: doctorPassword,
        phone: d.phone,
        age: d.age,
        gender: d.gender,
        role: 'doctor',
      });

      await Doctor.create({
        userId: user._id,
        specialization: d.specialization,
        department: d.department,
        experience: d.experience,
        fees: d.fees,
        availableSlots,
      });

      console.log(`Doctor created → ${d.email} / doctor123`);
    }

    // Create sample appointment
    const doctor = await Doctor.findOne();
    await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id,
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      status: 'booked',
    });
    console.log('Sample appointment created');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Seed completed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin   → admin@medicare.com / admin123');
    console.log('Patient → arjun@gmail.com / patient123');
    console.log('Doctor  → rajesh@medicare.com / doctor123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();