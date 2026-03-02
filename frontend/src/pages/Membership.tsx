import React, { useEffect, useState, useRef } from 'react';
// Remove Lottie and use SVG rocket animation instead
import { Star, Gift, Users, Calendar, Shield, ArrowRight } from 'lucide-react';
import logo from '../images/eae1499f-5f52-4311-8a8d-5fe1923bdb0f.jpeg';
import heroBg from '../images/treckmem.jpg';
import { API_URL } from '../config';

const Membership = () => {

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Ref for the membership form section
  const formRef = useRef<HTMLDivElement>(null);

  // Membership form state
  const [form, setForm] = useState({
    name: '',
    dob: '',
    mobile: '',
    email: '',
    occupation: '',
    address: '',
    plan: '',
    amount: 0,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string, amount: number } | null>(null);
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    if (form.dob) {
      const birthDate = new Date(form.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setAge(age);
    } else {
      setAge(null);
    }
  }, [form.dob]);

  const handlePlanSelect = (plan: { name: string, amount: number }) => {
    // Force plan name to match backend expectations
    let backendPlanName = plan.name;
    if (plan.name.toLowerCase().includes('2 year')) {
      backendPlanName = '2 Years Membership';
    } else if (plan.name.toLowerCase().includes('lifetime')) {
      backendPlanName = 'Lifetime Membership';
    }
    setSelectedPlan({ ...plan, name: backendPlanName });
    setForm({ ...form, plan: backendPlanName, amount: plan.amount });
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let startDate = null;
    let endDate = null;
    if (selectedPlan && selectedPlan.name === '2 Years Membership') {
      startDate = new Date();
      endDate = new Date();
      endDate.setFullYear(startDate.getFullYear() + 2);
    }

    const submitForm = {
      name: form.name,
      dob: form.dob,
      mobile: form.mobile,
      email: form.email,
      occupation: form.occupation,
      address: form.address,
      membershipPlan: selectedPlan ? selectedPlan.name : '',
      amount: selectedPlan ? selectedPlan.amount : 0,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };

    try {
      const res = await fetch(`${API_URL}/api/membership`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitForm)
      });
      const data = await res.json();
      if (res.ok) {
        setPopupMessage(data.message || 'Mail successfully submitted');
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3500);
        setForm({ name: '', dob: '', mobile: '', email: '', occupation: '', address: '', plan: '', amount: 0 });
        setSelectedPlan(null);
      } else {
        alert(data.error || 'Failed to submit. Please try again.');
      }
    } catch {
      alert('Error submitting form.');
    } finally {
      setIsLoading(false);
    }
  };

  const memberBenefits = [
    {
      icon: Gift,
      title: 'Exclusive Discounts',
      description: 'Save money on every trek with member-only pricing and special offers.'
    },
    {
      icon: Calendar,
      title: 'Priority Booking',
      description: 'Get first access to popular treks and secure your spot before general booking opens.'
    },
    {
      icon: Users,
      title: 'Member Community',
      description: 'Connect with fellow adventurers, share experiences, and join group activities.'
    },
    {
      icon: Shield,
      title: 'Enhanced Safety',
      description: 'Comprehensive insurance coverage and emergency support for peace of mind.'
    }
  ];

  const testimonials = [
    {
      name: 'Ayush Sharma',
      membership: 'Delhi',
      testimonial: 'The Gold membership has been incredible value. The discounts alone have saved me more than the membership cost, and the priority booking helped me secure spots on sold-out treks!'
    },
    {
      name: 'Jamuna Chattri',
      membership: 'Kolkata',
      testimonial: 'As a Platinum member, the personalized service is outstanding. My trek consultant helped plan the perfect Himalayan adventure, and the free annual trek was amazing!'
    },
    {
      name: 'Pavitra',
      membership: 'Bangalore',
      testimonial: 'Great entry-level membership! The gear consultation helped me choose the right equipment, and the member events are a fantastic way to meet fellow trekkers.'
    },
    {
      name: 'Prakash',
      membership: 'Bangalore',
      testimonial: 'Amazing trek experience! The team was very supportive and the arrangements were top-notch.'
    },
    {
      name: 'Safiq',
      membership: 'Tamilnadu',
      testimonial: 'Unforgettable journey! The guides were knowledgeable and made the trek safe and fun.'
    }
  ];

  // ...existing code...
  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="text-white text-2xl font-bold">Processing...</div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative py-20 flex items-center justify-center overflow-hidden">
        {/* Full Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Mountain trekking in India"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        {/* Centered Glassmorphism Card */}
        <div className="relative z-10 w-full flex justify-center">
          <div className="text-center max-w-2xl w-full bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-yellow-300 via-white to-emerald-300 rounded-full mb-8 shadow-2xl border-4 border-yellow-300 overflow-hidden relative animate-float">
              <img src={logo} alt="Membership Logo" className="h-full w-full object-cover rounded-full" />
              {/* Shine effect */}
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
                <div className="w-2/3 h-2/3 bg-gradient-to-tr from-white/60 to-transparent rounded-full blur-lg opacity-70 animate-shine"></div>
              </div>
            </div>
            <h1 className="text-5xl font-extrabold text-emerald-200 mb-4 drop-shadow-2xl tracking-tight animate-fade-in">Welcome to <span className="text-yellow-300">We Trek India</span> Membership</h1>
            <p className="text-2xl text-white mb-6 font-semibold animate-fade-in delay-200">Join our adventure community and unlock <span className="text-emerald-200 font-bold">exclusive benefits</span>, <span className="text-yellow-200 font-bold">priority booking</span>, and more!</p>
          </div>
        </div>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
          .animate-float {
            animation: float 2.5s ease-in-out infinite;
          }
          @keyframes shine {
            0% { opacity: 0.2; transform: translateX(-40px) rotate(-20deg); }
            50% { opacity: 0.7; transform: translateX(40px) rotate(20deg); }
            100% { opacity: 0.2; transform: translateX(-40px) rotate(-20deg); }
          }
          .animate-shine {
            animation: shine 2.5s linear infinite;
          }
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 1.2s cubic-bezier(.23,1,.32,1) both;
          }
          .delay-200 {
            animation-delay: 0.2s;
          }
        `}</style>
      </section>

      {/* Animated Membership Form */}
      <section
        className="py-20 text-white relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(20,30,48,0.7),rgba(36,59,85,0.7)), url('https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/30 animate-pulse" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          {/* Membership Plans Section */}
          <div className="w-full max-w-3xl mb-12 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-emerald-300 mb-8 text-center">Choose Your Membership Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plan 1: 2 Years Membership */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-200 flex flex-col">
                <h3 className="text-2xl font-bold text-emerald-600 mb-2">2 Years Membership</h3>
                <div className="text-xl font-semibold text-emerald-600 mb-4">₹299</div>
                <ul className="list-disc pl-5 text-gray-800 mb-4 space-y-2 flex-grow">
                  <li>Exclusive discounts on all treks for 2 years</li>
                  <li>Priority booking for popular treks</li>
                  <li>Access to member-only events and webinars</li>
                  <li>Personalized gear consultation</li>
                  <li>Digital membership card</li>
                </ul>
                <div className="text-sm text-gray-600 mb-4">Best for frequent trekkers who want short-term benefits and savings.</div>
                <button onClick={() => handlePlanSelect({ name: '2 Years Membership', amount: 299 })} className="mt-auto w-full py-2 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors duration-300">Choose Plan</button>
              </div>
              {/* Plan 2: Lifetime Membership */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-200 flex flex-col">
                <h3 className="text-2xl font-bold text-yellow-600 mb-2">Lifetime Membership</h3>
                <div className="text-xl font-semibold text-yellow-600 mb-4">₹999</div>
                <ul className="list-disc pl-5 text-gray-800 mb-4 space-y-2 flex-grow">
                  <li>Lifetime exclusive discounts on all treks</li>
                  <li>Free annual trek (one per year)</li>
                  <li>Dedicated trek consultant for planning</li>
                  <li>VIP access to member events and expeditions</li>
                  <li>Physical and digital membership card</li>
                  <li>Special recognition in our community</li>
                </ul>
                <div className="text-sm text-gray-600 mb-4">Perfect for passionate trekkers who want lifelong adventure and premium benefits.</div>
                <button onClick={() => handlePlanSelect({ name: 'Lifetime Membership', amount: 999 })} className="mt-auto w-full py-2 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition-colors duration-300">Choose Plan</button>
              </div>
            </div>
          </div>

          {selectedPlan && (
            <div ref={formRef} className="w-full max-w-lg">
              <h2 className="text-4xl font-bold mb-6 text-center animate-fade-in-up">Get Membership</h2>
              <form onSubmit={handleSubmit} className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="grid grid-cols-1 gap-6">
                  <input
                    type="text"
                    value={`Plan: ${selectedPlan.name} - ₹${selectedPlan.amount}`}
                    disabled
                    className="px-4 py-3 rounded-lg bg-white/80 text-gray-900 focus:ring-2 focus:ring-emerald-400 transition-all duration-300 text-center font-bold"
                  />
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" className="px-4 py-3 rounded-lg bg-white/80 text-gray-900 focus:ring-2 focus:ring-emerald-400 transition-all duration-300" />
                  <div className="relative">
                    <input name="dob" value={form.dob} onChange={handleChange} required placeholder="Date of Birth" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text' }} type="text" className="px-4 pr-24 py-3 rounded-lg bg-white/80 text-gray-900 focus:ring-2 focus:ring-emerald-400 transition-all duration-300 w-full" />
                    {age !== null && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        Age: {age}
                      </span>
                    )}
                  </div>
                  <input name="mobile" value={form.mobile} onChange={handleChange} required placeholder="Mobile Number" type="tel" pattern="[0-9]{10}" className="px-4 py-3 rounded-lg bg-white/80 text-gray-900 focus:ring-2 focus:ring-emerald-400 transition-all duration-300" />
                  <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" type="email" className="px-4 py-3 rounded-lg bg-white/80 text-gray-900 focus:ring-2 focus:ring-emerald-400 transition-all duration-300" />
                  <input name="occupation" value={form.occupation} onChange={handleChange} required placeholder="Occupation" className="px-4 py-3 rounded-lg bg-white/80 text-gray-900 focus:ring-2 focus:ring-emerald-400 transition-all duration-300" />
                  <textarea name="address" value={form.address} onChange={handleChange} required placeholder="Address" rows={2} className="px-4 py-3 rounded-lg bg-white/80 text-gray-900 focus:ring-2 focus:ring-emerald-400 transition-all duration-300" />
                </div>
                <button type="submit" className="mt-8 w-full py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-emerald-900 font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-300 animate-bounce">
                  Submit Details and Pay
                </button>
              </form>
            </div>
          )}
          {showPopup && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
              <div className="bg-white text-emerald-800 px-8 py-6 rounded-2xl shadow-2xl text-2xl font-bold animate-fade-in-up border-4 border-yellow-400 flex flex-col items-center">
                {/* Attractive SVG Rocket Animation */}
                <div className="relative w-32 h-40 mb-4">
                  {/* Stars */}
                  <svg className="absolute left-2 top-2 animate-pulse" width="16" height="16"><circle cx="8" cy="8" r="2" fill="#fbbf24" /></svg>
                  <svg className="absolute right-4 top-8 animate-pulse" width="12" height="12"><circle cx="6" cy="6" r="1.5" fill="#fbbf24" /></svg>
                  <svg className="absolute left-8 bottom-8 animate-pulse" width="10" height="10"><circle cx="5" cy="5" r="1" fill="#fbbf24" /></svg>
                  {/* Rocket Body */}
                  <svg className="absolute left-1/2 -translate-x-1/2 bottom-8 animate-rocket-launch" width="64" height="96" viewBox="0 0 64 96" fill="none">
                    <g>
                      <path d="M32 8C32 8 48 32 48 64C48 88 32 88 32 88C32 88 16 88 16 64C16 32 32 8 32 8Z" fill="#fbbf24" stroke="#f59e42" strokeWidth="2" />
                      <circle cx="32" cy="48" r="8" fill="#fff" stroke="#f59e42" strokeWidth="2" />
                      <ellipse cx="34" cy="46" rx="2" ry="3" fill="#e0e7ef" opacity="0.7" />
                      <polygon points="16,64 8,80 24,72" fill="#60a5fa" />
                      <polygon points="48,64 56,80 40,72" fill="#60a5fa" />
                      <g className="animate-flame">
                        <polygon points="28,88 32,96 36,88" fill="#f59e42" />
                        <polygon points="30,88 32,92 34,88" fill="#fbbf24" />
                      </g>
                    </g>
                  </svg>
                </div>
                <style>{`
                  @keyframes rocket-launch {
                    0% { transform: translateY(0); }
                    30% { transform: translateY(-10px); }
                    60% { transform: translateY(-20px); }
                    100% { transform: translateY(-30px); }
                  }
                  .animate-rocket-launch {
                    animation: rocket-launch 1.2s cubic-bezier(.23,1,.32,1) infinite alternate;
                  }
                  @keyframes flame {
                    0%, 100% { opacity: 1; transform: scaleY(1);}
                    50% { opacity: 0.7; transform: scaleY(1.2);}
                  }
                  .animate-flame {
                    animation: flame 0.5s infinite;
                  }
                `}</style>
                <span>{popupMessage}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Overview */}
      <section id="why-become-member" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Become a Member?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our membership program is designed to enhance your trekking experience with exclusive benefits and personalized service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {memberBenefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 group-hover:bg-emerald-600 transition-colors duration-300">
                  <benefit.icon className="h-8 w-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans section removed as requested */}

      {/* Member Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Our Members Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our community of adventurers about their membership experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.testimonial}"</p>
                <div className="flex items-center">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-emerald-600">{testimonial.membership}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 text-white relative"
        style={{
          backgroundImage: `linear-gradient(rgba(20, 30, 48, 0.7), rgba(36, 59, 85, 0.7)), url('https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of adventurers who have unlocked the full potential of Himalayan trekking with our membership program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              onClick={() => {
                window.location.href = '/?scrollTo=contact';
              }}
            >
              <span>Get Started Today</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            <button
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-800 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
              onClick={() => { window.location.href = '/contact'; }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
