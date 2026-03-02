// App.tsx
// Main React component. Sets up routing and layout for all pages in the app.
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PackageDetail from './pages/PackageDetail';
import Membership from './pages/Membership';
import ContactUs from './pages/ContactUs';
import Footer from './components/Footer';
import UsersInformation from './pages/UsersInformation';
import TrekDetail from './pages/TrekDetail';
import BikeRidingPackageDetail from './pages/BikeRidingPackageDetail';
import BookingPage from './pages/BookingPage';
import ScrollToTop from './components/ScrollToTop';

// New imports for the moved components
import About from './pages/About';
import Packages from './pages/Packages';
import Services from './pages/Services';

import Blog from './pages/Blog';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserLogin from './pages/UserLogin';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin routes - NO Header/Footer */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<UserLogin />} />

        {/* Regular routes - WITH Header/Footer */}
        <Route path="*" element={
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/package/:id" element={<PackageDetail />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/users" element={<UsersInformation />} />
                <Route path="/trek/:id" element={<TrekDetail />} />
                <Route path="/bikeriding/:id" element={<BikeRidingPackageDetail />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/services" element={<Services />} />

                <Route path="/blog" element={<Blog />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;