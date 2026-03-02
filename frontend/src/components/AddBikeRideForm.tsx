import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { API_URL } from '../config';

interface AddBikeRideFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any;
    isEditing?: boolean;
}

const AddBikeRideForm: React.FC<AddBikeRideFormProps> = ({ initialData, isEditing = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        difficulty: 'Moderate',
        rating: 0,
        price: '',
        duration: '',
        bestTime: '',
        detailedDescription: '',
        difficulty_details: ''
    });

    const [highlights, setHighlights] = useState<string[]>(['']);
    const [preparation, setPreparation] = useState<string[]>(['']);
    const [inclusions, setInclusions] = useState<string[]>(['']);
    const [exclusions, setExclusions] = useState<string[]>(['']);
    const [itinerary, setItinerary] = useState([{ day: 1, title: '', description: '' }]);

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [gallery, setGallery] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with data if editing
    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                title: initialData.title || '',
                location: initialData.location || '',
                difficulty: initialData.difficulty || 'Moderate',
                rating: initialData.rating || 0,
                price: initialData.price || '',
                duration: initialData.duration || '',
                bestTime: initialData.bestTime || '',
                detailedDescription: initialData.detailedDescription || '',
                difficulty_details: initialData.difficulty_details || ''
            });

            if (initialData.highlights && initialData.highlights.length > 0) setHighlights(initialData.highlights);
            if (initialData.preparation && initialData.preparation.length > 0) setPreparation(initialData.preparation);
            if (initialData.inclusions && initialData.inclusions.length > 0) setInclusions(initialData.inclusions);
            if (initialData.exclusions && initialData.exclusions.length > 0) setExclusions(initialData.exclusions);
            if (initialData.itinerary && initialData.itinerary.length > 0) setItinerary(initialData.itinerary);

            if (initialData.image) setImagePreview(initialData.image);
            if (initialData.gallery && initialData.gallery.length > 0) setGalleryPreviews(initialData.gallery);
        }
    }, [isEditing, initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleListChange = (index: number, value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => {
            const newList = [...prev];
            newList[index] = value;
            return newList;
        });
    };

    const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => [...prev, '']);
    };

    const removeListItem = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const handleItineraryChange = (index: number, field: string, value: string) => {
        setItinerary(prev => {
            const newItinerary = [...prev];
            newItinerary[index] = { ...newItinerary[index], [field]: value };
            return newItinerary;
        });
    };

    const addItineraryDay = () => {
        setItinerary(prev => [...prev, { day: prev.length + 1, title: '', description: '' }]);
    };

    const removeItineraryDay = (index: number) => {
        setItinerary(prev => prev.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 })));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setGallery(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index: number) => {
        setGallery(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Upload Main Image (only if changed)
            let imageUrl = isEditing ? initialData.image : '';
            if (image) {
                const imageFormData = new FormData();
                imageFormData.append('image', image);
                const imageResponse = await fetch(`${API_URL}/api/bikerides/upload`, {
                    method: 'POST',
                    body: imageFormData
                });
                const imageData = await imageResponse.json();
                if (imageData.success) {
                    imageUrl = imageData.imageUrl;
                }
            }

            // 2. Upload Gallery Images
            const galleryUrls: string[] = [];

            // Keep existing images
            galleryPreviews.forEach(preview => {
                if (preview.startsWith('http')) {
                    galleryUrls.push(preview);
                }
            });

            if (gallery.length > 0) {
                const galleryFormData = new FormData();
                gallery.forEach(file => galleryFormData.append('images', file));
                const galleryResponse = await fetch(`${API_URL}/api/bikerides/upload-multiple`, {
                    method: 'POST',
                    body: galleryFormData
                });
                const galleryData = await galleryResponse.json();
                if (galleryData.success) {
                    galleryUrls.push(...galleryData.imageUrls);
                }
            }

            // 3. Create or Update Bike Ride
            const bikeData = {
                ...formData,
                rating: Number(formData.rating) || 0,
                image: imageUrl,
                gallery: galleryUrls,
                highlights: highlights.filter(h => h.trim() !== ''),
                preparation: preparation.filter(p => p.trim() !== ''),
                inclusions: inclusions.filter(i => i.trim() !== ''),
                exclusions: exclusions.filter(e => e.trim() !== ''),
                itinerary: itinerary.filter(day => day.title.trim() !== '')
            };

            const url = isEditing
                ? `${API_URL}/api/bikerides/${initialData._id}`
                : `${API_URL}/api/bikerides`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bikeData)
            });

            const data = await response.json();

            if (data.success) {
                alert(`Bike ride ${isEditing ? 'updated' : 'added'} successfully!`);

                if (!isEditing) {
                    // Reset form
                    setFormData({
                        title: '', location: '', difficulty: 'Moderate', rating: 0, price: '', duration: '',
                        bestTime: '', detailedDescription: '', difficulty_details: ''
                    });
                    setImage(null);
                    setImagePreview(null);
                    setGallery([]);
                    setGalleryPreviews([]);
                    setHighlights(['']);
                    setPreparation(['']);
                    setInclusions(['']);
                    setExclusions(['']);
                    setItinerary([{ day: 1, title: '', description: '' }]);
                }
            } else {
                alert(`Failed to ${isEditing ? 'update' : 'add'} bike ride: ` + (data.error || data.message));
            }
        } catch (error) {
            console.error('Error adding/updating bike ride:', error);
            alert('Error adding/updating bike ride');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? 'Edit Bike Ride' : 'Add New Bike Ride'}</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ride Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Challenging">Challenging</option>
                                <option value="Extreme">Extreme</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                            <input
                                type="number"
                                name="rating"
                                min="0"
                                max="5"
                                step="0.1"
                                value={formData.rating}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input type="text" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                        <textarea
                            name="detailedDescription"
                            value={formData.detailedDescription}
                            onChange={handleInputChange}
                            rows={5}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Images</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Main Cover Image *</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-32 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="text-gray-400" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    required={!isEditing && !image}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                            {galleryPreviews.map((preview, index) => (
                                <div key={index} className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
                                    <img src={preview} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                <Plus className="text-gray-400" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Lists */}
                <div className="space-y-6">
                    {/* Highlights */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Highlights</h3>
                        {highlights.map((item, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleListChange(index, e.target.value, setHighlights)}
                                    placeholder="Enter highlight"
                                    className="flex-1 px-4 py-2 border rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeListItem(index, setHighlights)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addListItem(setHighlights)}
                            className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
                        >
                            <Plus className="w-4 h-4" /> Add Highlight
                        </button>
                    </div>

                    {/* Preparation */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Preparation</h3>
                        {preparation.map((item, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleListChange(index, e.target.value, setPreparation)}
                                    placeholder="Enter preparation tip"
                                    className="flex-1 px-4 py-2 border rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeListItem(index, setPreparation)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addListItem(setPreparation)}
                            className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
                        >
                            <Plus className="w-4 h-4" /> Add Preparation Tip
                        </button>
                    </div>

                    {/* Itinerary */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Itinerary</h3>
                        {itinerary.map((day, index) => (
                            <div key={index} className="border p-4 rounded-lg mb-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium text-gray-700">Day {day.day}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeItineraryDay(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={day.title}
                                    onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                    placeholder="Day Title"
                                    className="w-full px-3 py-2 border rounded-lg mb-2"
                                />
                                <textarea
                                    value={day.description}
                                    onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                    placeholder="Day Description"
                                    className="w-full px-3 py-2 border rounded-lg"
                                    rows={2}
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addItineraryDay}
                            className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
                        >
                            <Plus className="w-4 h-4" /> Add Day
                        </button>
                    </div>
                </div>

                <div className="pt-6 border-t">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                            } transition-colors`}
                    >
                        {isSubmitting ? (isEditing ? 'Updating Ride...' : 'Adding Ride...') : (isEditing ? 'Update Bike Ride' : 'Add Bike Ride')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBikeRideForm;
