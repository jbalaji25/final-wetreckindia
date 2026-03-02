import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Bike Ride Schema
const bikeRideSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    difficulty: { type: String, required: true },
    bestTime: String,
    duration: String,
    price: String,
    detailedDescription: String,
    difficulty_details: String,
    highlights: [String],
    itinerary: [{
        day: Number,
        title: String,
        description: String
    }],
    preparation: [String],
    gallery: [String],
    inclusions: [String],
    exclusions: [String],
    createdAt: { type: Date, default: Date.now }
});

const BikeRide = mongoose.model('BikeRide', bikeRideSchema);

// Routes

// Upload single image
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
});

// Upload multiple images
router.post('/upload-multiple', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);
    res.json({ success: true, imageUrls });
});

// Create a new bike ride
router.post('/', async (req, res) => {
    try {
        const newRide = new BikeRide(req.body);
        await newRide.save();
        res.status(201).json({ success: true, message: 'Bike ride created successfully', ride: newRide });
    } catch (error) {
        console.error('Error creating bike ride:', error);
        res.status(500).json({ success: false, message: 'Failed to create bike ride', error: error.message });
    }
});

// Get all bike rides
router.get('/', async (req, res) => {
    try {
        const rides = await BikeRide.find().sort({ createdAt: -1 });
        res.json({ success: true, rides });
    } catch (error) {
        console.error('Error fetching bike rides:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch bike rides' });
    }
});

// Get a single bike ride by ID
router.get('/:id', async (req, res) => {
    try {
        const ride = await BikeRide.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ success: false, message: 'Bike ride not found' });
        }
        res.json({ success: true, ride });
    } catch (error) {
        console.error('Error fetching bike ride:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch bike ride' });
    }
});

// Update a bike ride
router.put('/:id', async (req, res) => {
    try {
        const updatedRide = await BikeRide.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRide) {
            return res.status(404).json({ success: false, message: 'Bike ride not found' });
        }
        res.json({ success: true, message: 'Bike ride updated successfully', ride: updatedRide });
    } catch (error) {
        console.error('Error updating bike ride:', error);
        res.status(500).json({ success: false, message: 'Failed to update bike ride', error: error.message });
    }
});

// Delete a bike ride
router.delete('/:id', async (req, res) => {
    try {
        const deletedRide = await BikeRide.findByIdAndDelete(req.params.id);
        if (!deletedRide) {
            return res.status(404).json({ success: false, message: 'Bike ride not found' });
        }
        res.json({ success: true, message: 'Bike ride deleted successfully' });
    } catch (error) {
        console.error('Error deleting bike ride:', error);
        res.status(500).json({ success: false, message: 'Failed to delete bike ride' });
    }
});

export default router;
