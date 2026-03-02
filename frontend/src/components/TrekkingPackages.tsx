import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, Star, ArrowRight } from 'lucide-react';
import Slider from 'react-slick';
import { API_URL } from '../config';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Define interface for Trekking Package
interface TrekPackage {
  id: number | string;
  title: string;
  location: string;
  difficulty: string;
  rating: number;
  image: string;
  description: string;
  highlights: string[];
  trekDuration?: string;
  suitableFor?: string;
  _id?: string; // For MongoDB items
}

const TrekkingPackages = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [allPackages, setAllPackages] = useState<TrekPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchTrekkingPackages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/trekking`);
        const data = await response.json();

        if (data.success) {
          // Transform dynamic packages to match the interface
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dynamicPackages = data.treks.map((trek: any) => ({
            ...trek,
            id: trek._id, // Use _id as id for dynamic packages
            image: trek.image.replace('http://localhost:5002', API_URL),
            // Ensure all required fields are present or have defaults
            rating: trek.rating || 0,
            highlights: trek.highlights || [],
            trekDuration: trek.trekDuration || 'N/A',
            suitableFor: trek.suitableFor || 'All Ages'
          }));

          setAllPackages(dynamicPackages);
        }
      } catch (error) {
        console.error('Error fetching trekking packages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrekkingPackages();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'Challenging': return 'text-orange-600 bg-orange-100';
      case 'Extreme': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <section id="trekking-packages" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trekking adventures...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="trekking-packages" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Popular Trekking
            <span className="text-emerald-600 block">Packages</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Embark on an unforgettable journey with our most popular trekking packages. Whether you're a seasoned mountaineer or a first-time hiker, we have the perfect Himalayan adventure waiting for you.
          </p>
        </div>

        {/* Packages Grid */}
        {isMobile && allPackages.length > 1 ? (
          <Slider {...sliderSettings}>
            {allPackages.map((pkg) => (
              <div key={pkg.id} className="px-2">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Trek+Image';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(pkg.difficulty)}`}>
                        {pkg.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {pkg.location}
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">{pkg.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{pkg.description}</p>

                    {/* Package Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                        {pkg.trekDuration}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-emerald-600" />
                        {pkg.suitableFor}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Highlights:</div>
                      <div className="flex flex-wrap gap-1">
                        {pkg.highlights.slice(0, 3).map((highlight, index) => (
                          <span key={index} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                      <Link
                        to={`/trek/${pkg.id}`}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
            {allPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Trek+Image';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(pkg.difficulty)}`}>
                      {pkg.difficulty}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {pkg.location}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{pkg.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{pkg.description}</p>

                  {/* Package Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                      {pkg.trekDuration}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-emerald-600" />
                      {pkg.suitableFor}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Highlights:</div>
                    <div className="flex flex-wrap gap-1">
                      {pkg.highlights.slice(0, 3).map((highlight, index) => (
                        <span key={index} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                    <Link
                      to={`/trek/${pkg.id}`}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrekkingPackages;
