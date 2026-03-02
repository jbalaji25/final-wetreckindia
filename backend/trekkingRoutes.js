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
        // Create directory if it doesn't exist
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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Trekking Schema
const trekkingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    difficulty: { type: String, required: true },
    rating: { type: Number, default: 0 },
    image: { type: String, required: true }, // Main image URL
    description: { type: String, required: true },
    detailedDescription: { type: String },
    highlights: [String],
    bestTime: String,
    difficulty_details: String,
    preparation: [String],
    itinerary: [{
        day: Number,
        title: String,
        description: String,
        altitude: String,
        distance: String
    }],
    inclusions: [String],
    exclusions: [String],
    gallery: [String], // Array of image URLs
    trekFee: String,
    reportingDates: String,
    contact: String,
    trekLevel: String,
    trekDuration: String,
    highestAltitude: String,
    suitableFor: String,
    totalTrekDistance: String,
    basecamp: String,
    accommodationType: String,
    pickupPoint: String,
    createdAt: { type: Date, default: Date.now }
});

const Trekking = mongoose.model('Trekking', trekkingSchema);

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

// Create a new trekking package
router.post('/', async (req, res) => {
    try {
        const newTrek = new Trekking(req.body);
        await newTrek.save();
        res.status(201).json({ success: true, message: 'Trekking package created successfully', trek: newTrek });
    } catch (error) {
        console.error('Error creating trekking package:', error);
        res.status(500).json({ success: false, message: 'Failed to create trekking package', error: error.message });
    }
});

// Get all trekking packages
router.get('/', async (req, res) => {
    try {
        const treks = await Trekking.find().sort({ createdAt: -1 });
        res.json({ success: true, treks });
    } catch (error) {
        console.error('Error fetching trekking packages:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch trekking packages' });
    }
});

// Get a single trekking package by ID
router.get('/:id', async (req, res) => {
    try {
        const trek = await Trekking.findById(req.params.id);
        if (!trek) {
            return res.status(404).json({ success: false, message: 'Trekking package not found' });
        }
        res.json({ success: true, trek });
    } catch (error) {
        console.error('Error fetching trekking package:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch trekking package' });
    }
});

// Update a trekking package
router.put('/:id', async (req, res) => {
    try {
        const updatedTrek = await Trekking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTrek) {
            return res.status(404).json({ success: false, message: 'Trekking package not found' });
        }
        res.json({ success: true, message: 'Trekking package updated successfully', trek: updatedTrek });
    } catch (error) {
        console.error('Error updating trekking package:', error);
        res.status(500).json({ success: false, message: 'Failed to update trekking package' });
    }
});

// Delete a trekking package
router.delete('/:id', async (req, res) => {
    try {
        const deletedTrek = await Trekking.findByIdAndDelete(req.params.id);
        if (!deletedTrek) {
            return res.status(404).json({ success: false, message: 'Trekking package not found' });
        }
        res.json({ success: true, message: 'Trekking package deleted successfully' });
    } catch (error) {
        console.error('Error deleting trekking package:', error);
        res.status(500).json({ success: false, message: 'Failed to delete trekking package' });
    }
});

export default router;
