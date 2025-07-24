require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// DB connect — only once, no reconnections
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI,{
  dbName: 'tourism-website',
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));



// // Example route
app.get("/api/test", (req, res) => {
  res.json({ msg: "🔥 Express backend live on Vercel!" });
});


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/agency', require('./routes/agencyRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/discounts', require('./routes/discountRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/tours', require('./routes/tourRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));

app.listen(process.env.PORT || 5001, () => {
  console.log(`Server running on port ${process.env.PORT || 5001}`);
});

module.exports = app; 
