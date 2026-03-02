
import { Award, Shield, Heart, Users } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Award,
      title: 'Expert Guides',
      description: 'Our certified mountain guides have decades of experience and intimate knowledge of every trail.'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'We maintain the highest safety standards with modern equipment and comprehensive emergency protocols.'
    },
    {
      icon: Heart,
      title: 'Sustainable Tourism',
      description: 'We are committed to responsible trekking practices that preserve nature for future generations.'
    },
    {
      icon: Users,
      title: 'Small Groups',
      description: 'We keep our groups small to ensure personalized attention and minimal environmental impact.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 id="about-us-header" className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Your Trusted
              <span className="text-emerald-600 block">Adventure Partner</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              For over 15 years, We Trek India has been leading adventurers through the most spectacular landscapes of the Indian Himalayas. From the snow-capped peaks of Kashmir to the ancient trails of Uttarakhand, we create unforgettable journeys that connect you with nature's grandeur.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our mission is to provide safe, sustainable, and soul-stirring trekking experiences while supporting local communities and preserving the pristine beauty of our mountains.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">15+</div>
                <div className="text-gray-600">Years of Excellence</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">10,000+</div>
                <div className="text-gray-600">Successful Treks</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg"
              alt="Trekking group in mountains"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-emerald-600 text-white p-6 rounded-xl shadow-xl">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm">Customer Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 group-hover:bg-emerald-600 transition-colors duration-300">
                <feature.icon className="h-8 w-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
