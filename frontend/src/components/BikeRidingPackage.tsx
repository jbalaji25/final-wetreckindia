import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Star, ArrowRight, Clock } from 'lucide-react';
import { API_URL } from '../config';

// Define interface for Bike Ride Package
interface BikeRide {
  id: number | string;
  title: string;
  location: string;
  image: string;
  rating: number;
  difficulty: string;
  bestTime: string;
  duration: string;
  price: string;
  description?: string;
  detailedDescription: string;
  highlights: string[];
  _id?: string;
}

const BikeRidingPackage = () => {
  const [allRides, setAllRides] = useState<BikeRide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBikeRides = async () => {
      try {
        const response = await fetch(`${API_URL}/api/bikerides`);
        const data = await response.json();

        if (data.success) {
          // Transform dynamic rides to match the interface
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dynamicRides = data.rides.map((ride: any) => ({
            ...ride,
            id: ride._id,
            image: ride.image.replace('http://localhost:5002', API_URL),
            description: ride.detailedDescription ? ride.detailedDescription.substring(0, 150) + '...' : '',
            highlights: ride.highlights || []
          }));

          setAllRides(dynamicRides);
        }
      } catch (error) {
        console.error('Error fetching bike rides:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBikeRides();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'Challenging': return 'text-orange-600 bg-orange-100';
      case 'Difficult': return 'text-red-600 bg-red-100';
      case 'Extreme': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <section id="bike-riding-package" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bike adventures...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="bike-riding-package" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Popular Bike Riding
            <span className="text-emerald-600 block">Package</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Saddle up for an epic journey with our popular bike riding packages. From the winding roads of the Himalayas to the scenic coastal routes, our bike tours are designed for adventure seekers.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allRides.map((pkg) => (
            <div key={pkg.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group ${allRides.length === 1 ? 'lg:col-start-2' : ''}`}>
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Bike+Ride';
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
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{pkg.description || pkg.detailedDescription}</p>

                {/* Package Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-emerald-600" />
                    {pkg.bestTime}
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
                    to={`/bikeriding/${pkg.id}`}
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

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => {
              if (window.location.pathname === '/') {
                const el = document.getElementById('bike-riding-package');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/?scrollTo=bike-riding-package';
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

export default BikeRidingPackage;
