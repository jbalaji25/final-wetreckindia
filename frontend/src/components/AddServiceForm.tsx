import React, { useState } from 'react';
import { Plus, Trash2, Tent, Utensils, Camera, Map, Users, Shield, Heart, Star, Sun, Cloud } from 'lucide-react';
import { API_URL } from '../config';

const AddServiceForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: 'Tent'
    });

    const [features, setFeatures] = useState<string[]>(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const icons = [
        { name: 'Tent', component: Tent },
        { name: 'Utensils', component: Utensils },
        { name: 'Camera', component: Camera },
        { name: 'Map', component: Map },
        { name: 'Users', component: Users },
        { name: 'Shield', component: Shield },
        { name: 'Heart', component: Heart },
        { name: 'Star', component: Star },
        { name: 'Sun', component: Sun },
        { name: 'Cloud', component: Cloud }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        setFeatures(prev => {
            const newFeatures = [...prev];
            newFeatures[index] = value;
            return newFeatures;
        });
    };

    const addFeature = () => {
        setFeatures(prev => [...prev, '']);
    };

    const removeFeature = (index: number) => {
        setFeatures(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const serviceData = {
                ...formData,
                features: features.filter(f => f.trim() !== '')
            };

            const response = await fetch(`${API_URL}/api/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Service added successfully!');
                setFormData({ title: '', description: '', icon: 'Tent' });
                setFeatures(['']);
            } else {
                alert('Failed to add service: ' + data.message);
            }
        } catch (error) {
            console.error('Error adding service:', error);
            alert('Error adding service');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Service</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Icon</label>
                    <div className="grid grid-cols-5 gap-4">
                        {icons.map((iconObj) => (
                            <button
                                key={iconObj.name}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, icon: iconObj.name }))}
                                className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-colors ${formData.icon === iconObj.name
                                    ? 'border-emerald-600 bg-emerald-50 text-emerald-600'
                                    : 'border-gray-200 hover:border-emerald-300'
                                    }`}
                            >
                                <iconObj.component className="w-6 h-6" />
                                <span className="text-xs">{iconObj.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                    {features.map((feature, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                placeholder="Enter feature"
                                className="flex-1 px-4 py-2 border rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addFeature}
                        className="flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 mt-2"
                    >
                        <Plus className="w-4 h-4" /> Add Feature
                    </button>
                </div>

                <div className="pt-6 border-t">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                            } transition-colors`}
                    >
                        {isSubmitting ? 'Adding Service...' : 'Add Service'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddServiceForm;
