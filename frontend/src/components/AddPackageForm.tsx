import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { API_URL } from '../config';

interface ItineraryDay {
    day: number;
    title: string;
    description: string;
    altitude?: string;
    distance?: string;
}

interface AddPackageFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any;
    isEditing?: boolean;
}

const AddPackageForm: React.FC<AddPackageFormProps> = ({ initialData, isEditing = false }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        rating: 4.5,
        description: '',
        detailedDescription: '',
        bestTime: '',
        trekFee: '',
        reportingDates: '',
        contact: '',
        trekLevel: '',
        trekDuration: '',
        highestAltitude: '',
        suitableFor: '',
        totalTrekDistance: '',
        basecamp: '',
        accommodationType: '',
        pickupPoint: '',
    });

    // Dynamic Arrays State
    const [highlights, setHighlights] = useState<string[]>(['']);
    const [inclusions, setInclusions] = useState<string[]>(['']);
    const [exclusions, setExclusions] = useState<string[]>(['']);
    const [preparation, setPreparation] = useState<string[]>(['']);
    const [itinerary, setItinerary] = useState<ItineraryDay[]>([
        { day: 1, title: '', description: '', altitude: '', distance: '' }
    ]);

    // Image State
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [mainImagePreview, setMainImagePreview] = useState<string>('');
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    // Initialize form with data if editing
    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                title: initialData.title || '',
                location: initialData.location || '',
                price: initialData.price || '',
                rating: initialData.rating || 4.5,
                description: initialData.description || '',
                detailedDescription: initialData.detailedDescription || '',
                bestTime: initialData.bestTime || '',
                trekFee: initialData.trekFee || '',
                reportingDates: initialData.reportingDates || '',
                contact: initialData.contact || '',
                trekLevel: initialData.trekLevel || '',
                trekDuration: initialData.trekDuration || '',
                highestAltitude: initialData.highestAltitude || '',
                suitableFor: initialData.suitableFor || '',
                totalTrekDistance: initialData.totalTrekDistance || '',
                basecamp: initialData.basecamp || '',
                accommodationType: initialData.accommodationType || '',
                pickupPoint: initialData.pickupPoint || '',
            });

            if (initialData.highlights && initialData.highlights.length > 0) setHighlights(initialData.highlights);
            if (initialData.inclusions && initialData.inclusions.length > 0) setInclusions(initialData.inclusions);
            if (initialData.exclusions && initialData.exclusions.length > 0) setExclusions(initialData.exclusions);
            if (initialData.preparation && initialData.preparation.length > 0) setPreparation(initialData.preparation);
            if (initialData.itinerary && initialData.itinerary.length > 0) setItinerary(initialData.itinerary);

            if (initialData.image) setMainImagePreview(initialData.image);
            if (initialData.gallery && initialData.gallery.length > 0) setGalleryPreviews(initialData.gallery);
        }
    }, [isEditing, initialData]);

    // Handlers for basic fields
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handlers for dynamic arrays (highlights, inclusions, etc.)
    const handleArrayChange = (index: number, value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => {
            const newArray = [...prev];
            newArray[index] = value;
            return newArray;
        });
    };

    const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => [...prev, '']);
    };

    const removeArrayItem = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    // Handlers for Itinerary
    const handleItineraryChange = (index: number, field: keyof ItineraryDay, value: string | number) => {
        setItinerary(prev => {
            const newItinerary = [...prev];
            newItinerary[index] = { ...newItinerary[index], [field]: value };
            return newItinerary;
        });
    };

    const addItineraryDay = () => {
        setItinerary(prev => [
            ...prev,
            { day: prev.length + 1, title: '', description: '', altitude: '', distance: '' }
        ]);
    };

    const removeItineraryDay = (index: number) => {
        setItinerary(prev => prev.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 })));
    };

    // Image Handlers
    const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setGalleryImages(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index: number) => {
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Submit Handler
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // 1. Upload Main Image (only if changed)
            let mainImageUrl = isEditing ? initialData.image : '';
            if (mainImage) {
                const imageFormData = new FormData();
                imageFormData.append('image', mainImage);

                const response = await fetch(`${API_URL}/api/packages/upload`, {
                    method: 'POST',
                    body: imageFormData,
                });

                if (!response.ok) throw new Error('Failed to upload main image');
                const data = await response.json();
                mainImageUrl = `${API_URL}${data.url}`;
            }

            // 2. Upload Gallery Images
            const galleryUrls: string[] = [];

            // Keep existing images that are still in previews
            galleryPreviews.forEach(preview => {
                if (preview.startsWith('http')) {
                    galleryUrls.push(preview);
                }
            });

            if (galleryImages.length > 0) {
                const galleryFormData = new FormData();
                galleryImages.forEach(file => galleryFormData.append('images', file));

                const response = await fetch(`${API_URL}/api/packages/upload-multiple`, {
                    method: 'POST',
                    body: galleryFormData,
                });

                if (!response.ok) throw new Error('Failed to upload gallery images');
                const data = await response.json();
                data.urls.forEach((url: string) => galleryUrls.push(`${API_URL}${url}`));
            }

            // 3. Create or Update Package
            const packageData = {
                ...formData,
                image: mainImageUrl,
                gallery: galleryUrls,
                highlights: highlights.filter(h => h.trim() !== ''),
                inclusions: inclusions.filter(i => i.trim() !== ''),
                exclusions: exclusions.filter(e => e.trim() !== ''),
                preparation: preparation.filter(p => p.trim() !== ''),
                itinerary: itinerary.filter(day => day.title.trim() !== ''),
            };

            const url = isEditing
                ? `${API_URL}/api/packages/${initialData._id}`
                : `${API_URL}/api/packages`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(packageData),
            });

            if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} package`);

            setSuccess(`Package ${isEditing ? 'updated' : 'created'} successfully!`);

            if (!isEditing) {
                // Reset form only if adding new
                setFormData({
                    title: '', location: '', price: '', rating: 4.5, description: '', detailedDescription: '',
                    bestTime: '', trekFee: '', reportingDates: '', contact: '', trekLevel: '', trekDuration: '',
                    highestAltitude: '', suitableFor: '', totalTrekDistance: '', basecamp: '', accommodationType: '', pickupPoint: '',
                });
                setHighlights(['']);
                setInclusions(['']);
                setExclusions(['']);
                setPreparation(['']);
                setItinerary([{ day: 1, title: '', description: '', altitude: '', distance: '' }]);
                setMainImage(null);
                setMainImagePreview('');
                setGalleryImages([]);
                setGalleryPreviews([]);
                window.scrollTo(0, 0);
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditing ? 'Edit Tour' : 'Add New Tour'}</h2>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Basic Information */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tour Title *</label>
                            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="e.g., Sandakphu Trek" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                            <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="e.g., West Bengal, India" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                            <input required type="text" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="e.g., 12500/- per person" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Brief summary for the card view..." />
                    </div>
                </section>

                {/* Images */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Images</h3>

                    {/* Main Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Cover Image *</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 border border-gray-300">
                                <Upload className="w-4 h-4" />
                                {isEditing ? 'Change Image' : 'Choose Image'}
                                <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" required={!isEditing && !mainImagePreview} />
                            </label>
                            {mainImagePreview && (
                                <img src={mainImagePreview} alt="Preview" className="h-20 w-32 object-cover rounded-lg border" />
                            )}
                        </div>
                    </div>

                    {/* Gallery */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
                        <div className="space-y-3">
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg inline-flex items-center gap-2 border border-gray-300">
                                <Plus className="w-4 h-4" />
                                Add Photos
                                <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
                            </label>

                            {galleryPreviews.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {galleryPreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img src={preview} alt={`Gallery ${index}`} className="h-20 w-20 object-cover rounded-lg border" />
                                            <button type="button" onClick={() => removeGalleryImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Detailed Info */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Detailed Information</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                        <textarea name="detailedDescription" value={formData.detailedDescription} onChange={handleChange} rows={5} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trek Level</label>
                            <select name="trekLevel" value={formData.trekLevel} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500">
                                <option value="">Select Level</option>
                                <option value="Easy">Easy</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Difficult">Difficult</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <input type="text" name="trekDuration" value={formData.trekDuration} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="e.g., 6 Days / 5 Nights" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Highest Altitude</label>
                            <input type="text" name="highestAltitude" value={formData.highestAltitude} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="e.g., 11,930 ft" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Best Time</label>
                            <input type="text" name="bestTime" value={formData.bestTime} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="e.g., March to May" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Distance</label>
                            <input type="text" name="totalTrekDistance" value={formData.totalTrekDistance} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="e.g., 45 km" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base Camp</label>
                            <input type="text" name="basecamp" value={formData.basecamp} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                        </div>
                    </div>
                </section>

                {/* Highlights */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Highlights</h3>
                    {highlights.map((highlight, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={highlight}
                                onChange={(e) => handleArrayChange(index, e.target.value, setHighlights)}
                                className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                placeholder={`Highlight ${index + 1}`}
                            />
                            <button type="button" onClick={() => removeArrayItem(index, setHighlights)} className="text-red-500 hover:text-red-700 p-2">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem(setHighlights)} className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700">
                        <Plus className="w-4 h-4" /> Add Highlight
                    </button>
                </section>

                {/* Preparation */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Preparation</h3>
                    {preparation.map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange(index, e.target.value, setPreparation)}
                                className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                placeholder={`Preparation Tip ${index + 1}`}
                            />
                            <button type="button" onClick={() => removeArrayItem(index, setPreparation)} className="text-red-500 hover:text-red-700 p-2">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem(setPreparation)} className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700">
                        <Plus className="w-4 h-4" /> Add Preparation Tip
                    </button>
                </section>

                {/* Itinerary */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Itinerary</h3>
                    {itinerary.map((day, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium text-gray-700">Day {day.day}</h4>
                                <button type="button" onClick={() => removeItineraryDay(index)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={day.title}
                                    onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Day Title (e.g., Arrival in Manali)"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={day.altitude || ''}
                                        onChange={(e) => handleItineraryChange(index, 'altitude', e.target.value)}
                                        className="w-1/2 p-2 border rounded-lg"
                                        placeholder="Altitude"
                                    />
                                    <input
                                        type="text"
                                        value={day.distance || ''}
                                        onChange={(e) => handleItineraryChange(index, 'distance', e.target.value)}
                                        className="w-1/2 p-2 border rounded-lg"
                                        placeholder="Distance"
                                    />
                                </div>
                            </div>
                            <textarea
                                value={day.description}
                                onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                rows={2}
                                placeholder="Day description..."
                            />
                        </div>
                    ))}
                    <button type="button" onClick={addItineraryDay} className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700">
                        <Plus className="w-4 h-4" /> Add Day
                    </button>
                </section>

                {/* Inclusions & Exclusions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Inclusions</h3>
                        {inclusions.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleArrayChange(index, e.target.value, setInclusions)}
                                    className="flex-grow p-2 border rounded-lg"
                                    placeholder="Included item"
                                />
                                <button type="button" onClick={() => removeArrayItem(index, setInclusions)} className="text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem(setInclusions)} className="flex items-center gap-2 text-orange-600 font-medium">
                            <Plus className="w-4 h-4" /> Add Inclusion
                        </button>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Exclusions</h3>
                        {exclusions.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleArrayChange(index, e.target.value, setExclusions)}
                                    className="flex-grow p-2 border rounded-lg"
                                    placeholder="Excluded item"
                                />
                                <button type="button" onClick={() => removeArrayItem(index, setExclusions)} className="text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem(setExclusions)} className="flex items-center gap-2 text-orange-600 font-medium">
                            <Plus className="w-4 h-4" /> Add Exclusion
                        </button>
                    </section>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                            }`}
                    >
                        {loading ? (isEditing ? 'Updating Tour...' : 'Creating Tour...') : (isEditing ? 'Update Tour' : 'Create Tour')}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddPackageForm;
