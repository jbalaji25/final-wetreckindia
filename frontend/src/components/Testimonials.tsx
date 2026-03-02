import { useState, useEffect } from 'react';
import logo from '../images/eae1499f-5f52-4311-8a8d-5fe1923bdb0f.jpeg';
import { Star, Quote } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Testimonials = () => {
  const [isMobile, setIsMobile] = useState(false);

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

  const testimonials = [
    {
      name: 'Ayush Sharma',
      location: 'Mumbai',
      package: 'Sandakphu-Phalut Trek',
      rating: 5,
      testimonial: 'An absolutely unforgettable trekking experience! The guides were fantastic and the views of Kanchenjunga were breathtaking. Highly recommended for all adventure lovers.'
    },
    {
      name: 'Jamuna Chattri',
      location: 'Ahmedabad',
      package: 'Darjeeling Tour',
      rating: 5,
      testimonial: 'Our family had a wonderful time on the Darjeeling tour. The itinerary was well-planned, and we enjoyed the toy train ride and the beautiful tea gardens. A perfect family vacation!'
    },
    {
      name: 'Pavitra',
      location: 'Chennai',
      package: 'Assam-Meghalaya Bike Ride',
      rating: 5,
      testimonial: 'The Assam-Meghalaya bike ride was an epic adventure! The roads were challenging but the landscapes were stunning. The support team was excellent and took care of everything.'
    },
    {
      name: 'prakash',
      location: 'Hyderabad',
      package: 'Goechala Trek',
      rating: 5,
      testimonial: 'The Goechala trek was tough but incredibly rewarding. The views of the Himalayas were out of this world. Thanks to the team for making it a safe and memorable journey.'
    },
    {
      name: 'Safiq',
      location: 'Jaipur',
      package: 'Thailand Tour',
      rating: 5,
      testimonial: 'Exploring Thailand with We Trek India was a fantastic experience. The local guides were very knowledgeable and the cultural experiences were amazing. I would definitely book with them again.'
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo at the top, centered */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="We Trek India Logo" className="w-24 h-24 rounded-full object-cover border-4 border-emerald-400 shadow-lg" />
        </div>
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our Trekkers
            <span className="text-emerald-600 block">Say About Us</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Read the experiences of thousands of adventurers who have trusted us with their Himalayan dreams.
          </p>
        </div>

        {/* Testimonials */}
        {isMobile ? (
          <Slider {...sliderSettings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-2">
                <div className="bg-gray-50 rounded-2xl p-8 flex flex-col h-full min-h-[340px]">
                  <div className="mb-4">
                    <Quote className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.testimonial}"
                  </p>
                  <div className="flex items-center">
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                      <div className="text-sm text-emerald-600 font-medium">{testimonial.package}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full min-h-[340px]">
                <div className="mb-4">
                  <Quote className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.testimonial}"
                </p>
                <div className="flex items-center">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                    <div className="text-sm text-emerald-600 font-medium">{testimonial.package}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-20 bg-emerald-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-emerald-200">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-emerald-200">Happy Trekkers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-emerald-200">Repeat Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-emerald-200">Trek Destinations</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;