import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Package Schema
const packageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    image: { type: String, required: true }, // Main image URL
    description: { type: String, required: true },
    highlights: [String],
    detailedDescription: String,
    itinerary: [{
        day: Number,
        title: String,
        description: String,
        altitude: String,
        distance: String
    }],
    inclusions: [String],
    exclusions: [String],
    bestTime: String,
    preparation: [String],
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Package = mongoose.model('Package', packageSchema);

// Upload single image
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ success: true, url: fileUrl, filename: req.file.filename });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload multiple images
router.post('/upload-multiple', upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
        res.json({ success: true, urls: fileUrls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all packages
router.get('/', async (req, res) => {
    try {
        const packages = await Package.find().sort({ createdAt: -1 });
        res.json({ success: true, packages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single package
router.get('/:id', async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ error: 'Package not found' });
        }
        res.json({ success: true, package: pkg });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new package
router.post('/', async (req, res) => {
    try {
        const packageData = req.body;
        const newPackage = new Package(packageData);
        await newPackage.save();
        res.status(201).json({ success: true, package: newPackage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update package
router.put('/:id', async (req, res) => {
    try {
        const packageData = req.body;
        packageData.updatedAt = new Date();

        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id,
            packageData,
            { new: true, runValidators: true }
        );

        if (!updatedPackage) {
            return res.status(404).json({ error: 'Package not found' });
        }

        res.json({ success: true, package: updatedPackage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete package
router.delete('/:id', async (req, res) => {
    try {
        const deletedPackage = await Package.findByIdAndDelete(req.params.id);

        if (!deletedPackage) {
            return res.status(404).json({ error: 'Package not found' });
        }

        res.json({ success: true, message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
