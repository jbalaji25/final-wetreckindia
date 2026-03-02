import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, CheckCircle, XCircle, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const BikeRidingPackageDetail = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname, packageData: ride } });
      return;
    }
    navigate('/booking', { state: { packageData: ride } });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'difficult': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await fetch(`${API_URL}/api/bikerides/${id}`);
        const data = await response.json();
        if (data.success) {
          const rideData = data.ride;
          rideData.image = rideData.image.replace('http://localhost:5002', API_URL);
          if (rideData.gallery && rideData.gallery.length > 0) {
            rideData.gallery = rideData.gallery.map((img: string) => img.replace('http://localhost:5002', API_URL));
          }
          setRide(rideData);
        } else {
          setError('Ride not found');
        }
      } catch (err) {
        console.error('Error fetching bike ride:', err);
        setError('Failed to load ride details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRide();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Ride not found'}</h2>
        <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-semibold">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="">
      {/* Hero Section */}
      <section
        className="relative h-96 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${ride.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{ride.title}</h1>
            <div className="flex items-center justify-center space-x-4 text-lg">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {ride.location}
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-1 text-yellow-400 fill-current" />
                {ride.rating}
              </div>
            </div>
          </div>
        </div>
        <Link
          to="/?scrollTo=bike-riding-package"
          className="absolute top-8 left-8 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className={`font-semibold px-2 py-1 rounded text-sm inline-block ${getDifficultyColor(ride.difficulty)}`}>{ride.difficulty}</div>
                <div className="text-sm text-gray-600 mt-1">Difficulty</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold">{ride.duration}</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold">{ride.bestTime}</div>
                <div className="text-sm text-gray-600">Best Time</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Ride</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{ride.detailedDescription}</p>
              <p className="text-gray-700 leading-relaxed">{ride.difficulty_details}</p>
            </div>

            {/* Highlights */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ride Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                {ride.highlights.map((highlight: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Itinerary</h2>
              <div className="relative space-y-4 text-left">
                {ride.itinerary.map((day: { day: number; title: string; description: string }, index: number) => (
                  <div key={index} id={`day-${index}`} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Day {day.day}: {day.title}
                    </h3>
                    <p className="text-gray-700">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Preparation Required</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                <ul className="space-y-2">
                  {ride.preparation.map((item: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gallery */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Photo Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ride.gallery.map((image: string, index: number) => (
                  <div key={index} className="relative group overflow-hidden rounded-lg cursor-pointer" onClick={() => setSelectedImage(image as string)}>
                    <img
                      src={image as string}
                      alt={`${ride.title} gallery ${index + 1}`}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{ride.price}</div>
              </div>

              <button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold text-lg transition-colors duration-200 mb-4"
                onClick={handleBookNow}
              >
                Book Now
              </button>

              <button
                className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3 rounded-lg font-semibold transition-colors duration-200 mb-6"
                onClick={() => { window.location.href = '/contact'; }}
              >
                Enquire Now
              </button>

              {/* Inclusions */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Inclusions</h3>
                <ul className="space-y-2">
                  {ride.inclusions.map((item: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Exclusions</h3>
                <ul className="space-y-2">
                  {ride.exclusions.map((item: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <XCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
              onClick={() => setSelectedImage(null)}
            >
              <XCircle className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BikeRidingPackageDetail;
