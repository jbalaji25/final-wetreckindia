import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, Star, ArrowRight } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { API_URL } from '../config';

interface PackageData {
  id: string;
  title: string;
  location: string;
  image: string;
  rating: number;
  description: string;
  trekDuration: string;
  duration?: string;
  groupSize?: string;
  price: string;
  highlights: string[];
  detailedDescription?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itinerary?: any[];
  inclusions?: string[];
  exclusions?: string[];
  bestTime?: string;
  preparation?: string[];
  gallery?: string[];
}

const Packages = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [allPackages, setAllPackages] = useState<PackageData[]>([]);
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
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/packages`);
        const data = await response.json();
        if (data.success) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dynamicPackages = data.packages.map((pkg: any) => ({
            id: pkg._id,
            title: pkg.title,
            location: pkg.location,
            image: pkg.image.replace('http://localhost:5002', API_URL),
            rating: pkg.rating,
            description: pkg.description,
            trekDuration: pkg.trekDuration || 'N/A',
            duration: pkg.trekDuration || 'N/A',
            groupSize: '10-15',
            price: pkg.price,
            highlights: pkg.highlights || [],
            detailedDescription: pkg.detailedDescription || '',
            itinerary: pkg.itinerary || [],
            inclusions: pkg.inclusions || [],
            exclusions: pkg.exclusions || [],
            bestTime: pkg.bestTime || '',
            preparation: pkg.preparation || [],
            gallery: pkg.gallery || []
          }));

          setAllPackages(dynamicPackages);
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
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

  if (isLoading) {
    return (
      <section id="packages" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tour packages...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 id="trek-packages-header" className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Popular Tour
            <span className="text-emerald-600 block">Packages</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore the world with our popular tour packages. From the serene mountains of the Himalayas to the vibrant culture of Thailand, our expertly crafted tours offer a blend of adventure and relaxation.
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
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
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
                        {pkg.trekDuration || pkg.duration || 'N/A'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-emerald-600" />
                        {pkg.groupSize || 'Group'}
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
                        to={`/package/${pkg.id}`}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
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
                      {pkg.trekDuration || pkg.duration || 'N/A'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-emerald-600" />
                      {pkg.groupSize || 'Group'}
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
                      to={`/package/${pkg.id}`}
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

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => {
              if (window.location.pathname === '/') {
                const el = document.getElementById('packages');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/?scrollTo=packages';
              }
            }}
          >
            View All Packages
          </button>
        </div>
      </div>
    </section>
  );
};

export default Packages;
