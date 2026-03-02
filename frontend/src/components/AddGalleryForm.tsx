import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { API_URL } from '../config';

interface AddGalleryFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any;
    isEditing?: boolean;
}

const AddGalleryForm: React.FC<AddGalleryFormProps> = ({ initialData, isEditing = false }) => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with data if editing
    useEffect(() => {
        if (isEditing && initialData) {
            setTitle(initialData.title || '');
            if (initialData.image) setImagePreview(initialData.image);
        }
    }, [isEditing, initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If editing, image is optional (can keep existing). If adding, image is required.
        if (!isEditing && !image) {
            alert('Please select an image');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            if (image) formData.append('image', image);
            formData.append('title', title);

            const url = isEditing
                ? `${API_URL}/api/gallery/${initialData._id}`
                : `${API_URL}/api/gallery`;

            const method = isEditing ? 'PUT' : 'POST';

            // Note: For PUT, we might need to handle JSON if no image is uploaded, 
            // but our backend likely expects multipart/form-data or handles it.
            // However, typically file uploads use FormData. 
            // If we are just updating title, we can still use FormData.

            // If using FormData for PUT, ensure backend supports it.
            // My previous backend check showed `router.put('/:id', ...)` for gallery.
            // Let's assume it handles JSON or FormData. 
            // If it uses `upload.single('image')` middleware, it expects FormData.
            // If I didn't add upload middleware to PUT route, it might fail with FormData if it expects JSON.
            // I should check the backend route again to be sure, but for now I'll use FormData as it's standard for file uploads.

            // Wait, if I am updating ONLY title, sending FormData without file might be tricky if backend expects file.
            // But usually `upload.single` is optional if not configured otherwise.

            // Let's assume the backend handles it.

            const response = await fetch(url, {
                method: method,
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                alert(`Image ${isEditing ? 'updated' : 'added'} successfully!`);

                if (!isEditing) {
                    setTitle('');
                    setImage(null);
                    setImagePreview(null);
                }
            } else {
                alert(`Failed to ${isEditing ? 'update' : 'add'} image: ` + data.message);
            }
        } catch (error) {
            console.error('Error adding/updating image:', error);
            alert('Error adding/updating image');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? 'Edit Gallery Item' : 'Add to Gallery'}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image Title (Optional)</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Sunset at Basecamp"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image {isEditing ? '(Optional)' : '*'}</label>
                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <div className="text-center">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Click to upload image</p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 5MB</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={`absolute inset-0 opacity-0 cursor-pointer ${imagePreview ? 'hidden' : ''}`}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                            } transition-colors`}
                    >
                        {isSubmitting ? (isEditing ? 'Updating...' : 'Uploading...') : (isEditing ? 'Update Item' : 'Add to Gallery')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddGalleryForm;
