import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Service Schema
const serviceSchema = new mongoose.Schema({
    icon: { type: String, required: true }, // Name of the icon (e.g., 'Tent', 'Map')
    title: { type: String, required: true },
    description: { type: String, required: true },
    features: [String],
    createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.model('Service', serviceSchema);

// Routes

// Create a new service
router.post('/', async (req, res) => {
    try {
        const newService = new Service(req.body);
        await newService.save();
        res.status(201).json({ success: true, message: 'Service created successfully', service: newService });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ success: false, message: 'Failed to create service', error: error.message });
    }
});

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.json({ success: true, services });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch services' });
    }
});

// Delete a service
router.delete('/:id', async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ success: false, message: 'Failed to delete service' });
    }
});

export default router;
