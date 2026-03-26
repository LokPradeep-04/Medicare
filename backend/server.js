require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

// Allow ALL origins to stop CORS errors during deployment debug
app.use(cors({
  origin: true,
  credentials: true,
}));

// Log every request to help debug
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Catch unhandled crashes
process.on('uncaughtException', (err) => {
  console.error('CRITICAL CRASH:', err);
});

app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const doctorRoutes = require('./routes/doctor.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const adminRoutes = require('./routes/admin.routes');
const chatbotRoutes = require('./routes/chatbot.routes');

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'MediCare API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
