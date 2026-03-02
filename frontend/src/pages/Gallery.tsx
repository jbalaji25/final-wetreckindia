import { useState, useEffect } from 'react';
import { Image as ImageIcon, Loader } from 'lucide-react';
import { API_URL } from '../config';

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
}

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch(`${API_URL}/api/gallery`);
      const data = await response.json();
      if (data.success) {
        const galleryItems = data.items.map((item: GalleryItem) => ({
          ...item,
          image: item.image.replace('http://localhost:5002', API_URL)
        }));
        setItems(galleryItems);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="gallery" className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Gallery</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the breathtaking beauty of our treks, bike rides, and camping adventures.
          </p>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-12 h-12 text-orange-600 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900">No images found</h3>
            <p className="text-gray-500 mt-2">Check back later for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item._id} className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title || 'Gallery Image'}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                </div>
                {item.title && (
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
