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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Gallery Schema
const gallerySchema = new mongoose.Schema({
    title: { type: String },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Gallery = mongoose.model('Gallery', gallerySchema);

// Routes

// Upload and create gallery item
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

        const newGalleryItem = new Gallery({
            title: req.body.title || '',
            image: imageUrl
        });

        await newGalleryItem.save();
        res.status(201).json({ success: true, message: 'Image added to gallery', item: newGalleryItem });
    } catch (error) {
        console.error('Error adding to gallery:', error);
        res.status(500).json({ success: false, message: 'Failed to add image', error: error.message });
    }
});

// Get all gallery items
router.get('/', async (req, res) => {
    try {
        const items = await Gallery.find().sort({ createdAt: -1 });
        res.json({ success: true, items });
    } catch (error) {
        console.error('Error fetching gallery items:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch gallery items' });
    }
});

// Update gallery item
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
        res.json({ success: true, message: 'Item updated successfully', item: updatedItem });
    } catch (error) {
        console.error('Error updating gallery item:', error);
        res.status(500).json({ success: false, message: 'Failed to update item' });
    }
});

// Delete gallery item
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Gallery.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        // Optional: Delete the file from filesystem
        // const filename = deletedItem.image.split('/').pop();
        // const filepath = path.join(__dirname, 'uploads', filename);
        // if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        res.status(500).json({ success: false, message: 'Failed to delete item' });
    }
});

export default router;
