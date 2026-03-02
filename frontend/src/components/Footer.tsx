import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import logoImg from '../images/eae1499f-5f52-4311-8a8d-5fe1923bdb0f.jpeg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_URL } from '../config';

// --- Footer Component ---
// This component renders the footer section of the website, including company info, quick links, popular treks, and social media links.
const Footer = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [popularPackages, setPopularPackages] = useState<any[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/packages`);
        const data = await response.json();
        if (data.success) {
          // Take first 6 packages for popular list
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setPopularPackages(data.packages.slice(0, 6).map((pkg: any) => ({
            label: pkg.title,
            href: `/package/${pkg._id}` // Note: MongoDB uses _id
          })));
        }
      } catch (error) {
        console.error('Failed to fetch packages for footer:', error);
      }
    };

    fetchPackages();
  }, []);

  // List of quick navigation links for the footer
  const quickLinks = [
    { label: 'About Us', href: '/?scrollTo=about-us-header' },
    { label: 'Trek Packages', href: '/?scrollTo=trek-packages-header' },
    { label: 'Services', href: '/?scrollTo=services-header' },
    { label: 'Gallery', href: '/?scrollTo=gallery-header' },
    { label: 'Contact', href: '/?scrollTo=contact-header' },
    { label: 'Blog', href: '/?scrollTo=blog-header' }
  ];

  // Social media links for the footer
  const socialLinks = [
    {
      icon: typeof Facebook === 'function' ? Facebook : () => (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-500" fill="currentColor"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24H12.82v-9.294H9.692V11.01h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.696h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0" /></svg>
      ),
      href: 'https://business.facebook.com/latest/home?asset_id=636523489539332&business_id=2354717018231401', label: 'Facebook'
    },
    {
      icon: typeof Instagram === 'function' ? Instagram : () => (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-500" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.396 3.635 1.363c-.967.967-1.232 2.14-1.291 3.417C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.277.324 2.45 1.291 3.417.967.967 2.14 1.232 3.417 1.291C8.332 21.987 8.741 22 12 22s3.668-.013 4.948-.072c1.277-.059 2.45-.324 3.417-1.291.967.967 1.232-2.14 1.291-3.417.059-1.28.072-1.689.072-4.948s-.013-3.668-.072-4.948c-.059-1.277-.324-2.45-1.291-3.417-.967-.967-2.14-1.232-3.417-1.291C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
      ),
      href: 'https://www.instagram.com/we_treks_india?igsh=bzY5ajlpZG5scHc0', label: 'Instagram'
    },
    {
      icon: typeof Twitter === 'function' ? Twitter : () => (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-500" fill="currentColor"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184A4.916 4.916 0 0 0 16.616 3c-2.717 0-4.92 2.206-4.92 4.917 0 .386.044.762.127 1.124C7.691 8.816 4.066 6.864 1.64 3.94c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.418A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636z" /></svg>
      ),
      href: '#', label: 'Twitter'
    },
    {
      icon: typeof Youtube === 'function' ? Youtube : () => (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-500" fill="currentColor"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.108-2.112C19.633 3.5 12 3.5 12 3.5s-7.633 0-9.39.574A2.994 2.994 0 0 0 .502 6.186C0 7.943 0 12 0 12s0 4.057.502 5.814a2.994 2.994 0 0 0 2.108 2.112C4.367 20.5 12 20.5 12 20.5s7.633 0 9.39-.574a2.994 2.994 0 0 0 2.108-2.112C24 16.057 24 12 24 12s0-4.057-.502-5.814zM9.545 15.568V8.432l6.545 3.568-6.545 3.568z" /></svg>
      ),
      href: 'https://youtube.com/@wetrek-adventure?si=77_G822ciazd-y8j', label: 'YouTube'
    }
  ];

  return (
    <footer className="bg-gradient-to-tr from-gray-900 via-emerald-900 to-black text-white">
      {/* Decorative top wave */}
      <div className="pointer-events-none">
        <svg className="w-full text-gray-900" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40 C360 0 1080 80 1440 40 L1440 80 L0 80 Z" fill="currentColor" opacity="0.08" />
        </svg>
      </div>


      {/* Main Footer */}
      <div className="container mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={logoImg} alt="We Trek India Logo" className="h-10 w-10 rounded-full object-cover border-2 border-emerald-400" />
              <span className="text-2xl font-extrabold">We Trek India</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">Curated treks and rides across the Indian Himalaya. Safety-first guides, small groups, local stays and authentic experiences.</p>
            <div className="flex items-center space-x-3">
              {socialLinks.map((s, i) => (
                <a key={i} href={s.href} aria-label={s.label} className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white">
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    {typeof s.icon === 'function' ? s.icon({ className: "h-5 w-5 text-emerald-500" }) : (typeof s.icon === 'object' ? s.icon : null)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-gray-300">
              {quickLinks.map((l, idx) => (
                <li key={idx}><Link to={l.href} className="hover:text-emerald-400 transition">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Popular Packages</h4>
            <ul className="space-y-2 text-gray-300">
              {popularPackages.map((t, i) => (
                <li key={i}><Link to={t.href} className="hover:text-emerald-400 transition">{t.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1" id="footer-contact">
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="text-gray-300 space-y-3">
              <div className="flex items-start gap-3"><MapPin className="h-5 w-5 text-emerald-400 mt-1" /><div>siliguri, West Bengal, India</div></div>
              <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-emerald-400" /><a href="tel:9566985698" className="hover:underline">+91 95669 85698</a></div>
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-emerald-400" /><a href="mailto:wetrekindia@gmail.com" className="hover:underline">wetrekindia@gmail.com</a></div>
              <div className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg><a href="https://wetrekindia.com" target="_blank" rel="noreferrer" className="hover:underline">wetrekindia.com</a></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm gap-4">
          <div>© {new Date().getFullYear()} We Trek India. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-emerald-400 transition">Privacy</a>
            <a href="#" className="hover:text-emerald-400 transition">Terms</a>
            <a href="#" className="hover:text-emerald-400 transition">Refunds</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
