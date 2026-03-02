
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Fallback */}
      <div className="absolute inset-0 z-0">
        <video
          src="/3135811-hd_1920_1080_24fps.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Discover the
          <span className="text-emerald-400 block">Adventures</span>
          with We Trek India
        </h1>
        <p className="text-xl sm:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
          From the majestic peaks of the Himalayas to the thrilling bike trails and serene tour destinations, we have a wide range of adventures for everyone. Explore our packages and create unforgettable memories with our expert guides.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            onClick={() => {
              if (window.location.pathname === '/') {
                const el = document.getElementById('packages');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/?scrollTo=packages';
              }
            }}
          >
            <span>Explore Packages</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          <button
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
            onClick={() => {
              if (window.location.pathname === '/') {
                const el = document.getElementById('gallery');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/?scrollTo=gallery';
              }
            }}
          >
            Watch Our Story
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-3">
            <MapPin className="h-6 w-6 text-emerald-400" />
            <div>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-gray-300">Destinations</div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Calendar className="h-6 w-6 text-emerald-400" />
            <div>
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm text-gray-300">Years Experience</div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Users className="h-6 w-6 text-emerald-400" />
            <div>
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-gray-300">Happy Trekkers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
