// Home.tsx
// Main landing page. Displays hero section, gallery, testimonials, and other info.
import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../pages/About';
import Packages from '../pages/Packages';
import Services from '../pages/Services';
import Testimonials from '../components/Testimonials';
import Gallery from '../pages/Gallery';
import TrekkingPackages from '../components/TrekkingPackages';
import BikeRidingPackage from '../components/BikeRidingPackage';




const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollToParam = params.get('scrollTo');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scrollToState = (location.state as any)?.scrollTo;
    const scrollTo = scrollToParam || scrollToState;

    if (scrollTo) {
      // Function to attempt scrolling
      const attemptScroll = (attemptsLeft: number) => {
        const element = document.getElementById(scrollTo);
        if (element) {
          // Add a small offset for the fixed header
          const headerOffset = 70;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Clean up URL if it was a query param
          if (scrollToParam) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          }
        } else if (attemptsLeft > 0) {
          // Retry after a short delay if element not found
          setTimeout(() => attemptScroll(attemptsLeft - 1), 100);
        }
      };

      // Start attempting to scroll
      setTimeout(() => attemptScroll(5), 100);
    }
  }, [location.search, location.state]);

  return (
    <div className="relative bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 overflow-hidden">


      <div className="relative z-10">
        <Hero />
        <About />
        <TrekkingPackages />
        <BikeRidingPackage />
        <Packages />
        <Services />
        <Testimonials />
        <Gallery />
      </div>
    </div>
  );
};

export default Home;

