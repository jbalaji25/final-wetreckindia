import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { sendEmail } from './mail.js';
import connectDB from './db.js';
import sendAdminEmailRouter from './sendAdminEmail.js';
import packageRoutes from './packageRoutes.js';
import trekkingRoutes from './trekkingRoutes.js';
import bikeRideRoutes from './bikeRideRoutes.js';
import galleryRoutes from './galleryRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import userRoutes from './userRoutes.js';
import membershipUserRoutes from './membershipUserRoutes.js';
import { adminLogin, verifyToken, verifyTokenEndpoint } from './adminAuth.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount Routes
app.use('/api/admin', sendAdminEmailRouter);
app.use('/api/packages', packageRoutes);
app.use('/api/trekking', trekkingRoutes);
app.use('/api/bikerides', bikeRideRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/membership-users', membershipUserRoutes);

// Admin Auth Routes
app.post('/api/admin/login', adminLogin);
app.get('/api/admin/verify', verifyTokenEndpoint);

const personDetailsSchema = new mongoose.Schema({
  name: String,
  age: String,
  relation: String,
  occupation: String,
  phone: String,
  email: String,
  city: String,
  state: String,
});

const healthDetailsSchema = new mongoose.Schema({
  heartConditions: String,
  respiratoryIssues: String,
  pastInjuries: String,
  otherConcerns: String,
  bloodGroup: String,
});

const bikeDetailsSchema = new mongoose.Schema({
  type: String,
  name: String,
  cc: String,
  experience: String,
});

const bookingSharedSchema = {
  packageId: String,
  packageTitle: String,
  personCount: Number,
  date: String,
  personDetails: [personDetailsSchema],
  arrivalPlace: String,
  pickupNeeded: Boolean,
  isMember: Boolean,
  membershipId: String,
  finalAmount: Number,
  createdAt: { type: Date, default: Date.now },
};

const tourBookingSchema = new mongoose.Schema({ ...bookingSharedSchema });
const trekBookingSchema = new mongoose.Schema({ ...bookingSharedSchema, healthDetails: healthDetailsSchema });
const bikeBookingSchema = new mongoose.Schema({ ...bookingSharedSchema, bikeDetails: bikeDetailsSchema });

const TourBooking = mongoose.model('TourBooking', tourBookingSchema);
const TrekBooking = mongoose.model('TrekBooking', trekBookingSchema);
const BikeBooking = mongoose.model('BikeBooking', bikeBookingSchema);

// Booking Endpoint
app.post('/api/v2/booking', async (req, res) => {
  try {
    const { bookingType, ...bookingData } = req.body;
    let booking;

    switch (bookingType) {
      case 'tour': booking = new TourBooking(bookingData); break;
      case 'trek': booking = new TrekBooking(bookingData); break;
      case 'bike': booking = new BikeBooking(bookingData); break;
      default: return res.status(400).json({ error: 'Invalid booking type' });
    }

    await booking.save();

    // Send emails
    try {
      const userEmail = bookingData.personDetails?.[0]?.email;
      const adminEmail = process.env.EMAIL_USER;
      const subject = `Booking Confirmation: ${bookingData.packageTitle}`;

      const personDetailsHtml = bookingData.personDetails.map(person => `
        <ul>
          <li>Name: ${person.name}</li>
          <li>Age: ${person.age}</li>
          <li>Phone: ${person.phone}</li>
          <li>Email: ${person.email}</li>
        </ul>
      `).join('');

      const html = `
        <h1>Booking Details</h1>
        <p>Package: ${bookingData.packageTitle}</p>
        <p>Date: ${bookingData.date}</p>
        <p>Persons: ${bookingData.personCount}</p>
        <p>Amount: ₹${bookingData.finalAmount}</p>
        <h3>Person Details:</h3>
        ${personDetailsHtml}
      `;

      if (userEmail) await sendEmail(userEmail, subject, html);
      if (adminEmail) await sendEmail(adminEmail, subject, html);

      res.json({ message: 'Booking saved and emails sent.' });
    } catch (emailError) {
      console.error('Email error:', emailError);
      res.json({ message: 'Booking saved but email failed.' });
    }
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to save booking.' });
  }
});

// Membership Schema & Routes
const membershipSchema = new mongoose.Schema({
  name: String,
  dob: String,
  mobile: String,
  email: String,
  occupation: String,
  address: String,
  membershipPlan: String,
  amount: Number,
  startDate: Date,
  endDate: Date,
  uniqueCode: String,
  createdAt: { type: Date, default: Date.now }
});
const Membership = mongoose.model('Membership', membershipSchema);

app.post('/api/membership', async (req, res) => {
  try {
    const { name, email, membershipPlan, amount } = req.body;

    // Check existing
    const existing = await Membership.findOne({ email });
    if (existing) {
      return res.json({ message: 'Already a member', member: existing });
    }

    const uniqueCode = 'MEM' + Date.now().toString().slice(-6);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + (membershipPlan.includes('Lifetime') ? 99 : 2));

    const newMember = new Membership({
      ...req.body,
      startDate,
      endDate,
      uniqueCode
    });

    await newMember.save();

    res.json({ message: 'Membership created', uniqueCode });
  } catch (err) {
    console.error('Membership error:', err);
    res.status(500).json({ error: 'Failed to create membership' });
  }
});

app.post('/api/validate-membership', async (req, res) => {
  try {
    const { email, membershipId } = req.body;
    const member = await Membership.findOne({ email, uniqueCode: membershipId });
    if (member) {
      res.json({ isValid: true, member });
    } else {
      res.json({ isValid: false, message: 'Invalid details' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Validation failed' });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});