import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import logo from '../images/eae1499f-5f52-4311-8a8d-5fe1923bdb0f.jpeg';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/?scrollTo=about' },
    { label: 'Tour Packages', href: '/?scrollTo=packages' },
    { label: 'Trekking', href: '/?scrollTo=trekking-packages' },
    { label: 'Bike Riding', href: '/?scrollTo=bike-riding-package' },
    { label: 'Services', href: '/?scrollTo=services' },
    { label: 'Gallery', href: '/?scrollTo=gallery' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm"
      onClick={() => console.log('Header clicked!')}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-auto py-2 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="Logo"
              style={{ height: 40, width: 40, objectFit: 'cover', borderRadius: '50%' }}
            />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">We Trek India</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
                onClick={(e) => {
                  const scrollToId = item.href.split('scrollTo=')[1];

                  if (scrollToId && isHomePage) {
                    e.preventDefault();
                    const element = document.getElementById(scrollToId);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else if (item.href === '/' && isHomePage) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (scrollToId && !isHomePage) {
                    e.preventDefault();
                    navigate('/', { state: { scrollTo: scrollToId } });
                  }

                  setIsMenuOpen(false);
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/membership"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Get Membership
            </Link>
            {user ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setShowLogout(!showLogout)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 font-medium focus:outline-none"
                >
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                {showLogout && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={() => {
                        logout();
                        setShowLogout(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="block py-1.5 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
                onClick={(e) => {
                  const scrollToId = item.href.split('scrollTo=')[1];

                  if (scrollToId && isHomePage) {
                    e.preventDefault();
                    const element = document.getElementById(scrollToId);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else if (item.href === '/' && isHomePage) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (scrollToId && !isHomePage) {
                    e.preventDefault();
                    navigate('/', { state: { scrollTo: scrollToId } });
                  }

                  setIsMenuOpen(false);
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/membership"
              className="block w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200 text-center"
              onClick={() => {
                setIsMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Get Membership
            </Link>
            {user ? (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex items-center px-4 mb-4">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <User className="h-6 w-6" />
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign out
                  </div>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block w-full mt-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200 text-center"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;