

// Phone number for contact
const phone = '+91 95669 85698';

// Email address for contact
const email = 'wetrekindia@gmail.com';

// Pre-filled Gmail compose link for contacting via email
const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;

/**
 * ContactUs component displays the contact information for We Trek India.
 * Includes phone and email links styled as buttons.
 */
const ContactUs = () => (
  // Main section with scenic background and centered content
  <section
    className="flex items-center justify-center font-sans relative min-h-screen"
    style={{
      backgroundImage: `linear-gradient(rgba(20, 30, 48, 0.7), rgba(36, 59, 85, 0.7)), url('https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    {/* Contact card container */}
    <div className="text-center text-slate-100 px-4 sm:px-6 lg:px-8 max-w-md w-full animate-fade-in bg-slate-900/70 rounded-2xl shadow-2xl py-12 backdrop-blur-md">
      {/* Heading */}
      <h1 id="contact-header" className="text-4xl font-extrabold mb-6 tracking-tight font-sans animate-bounce text-amber-300 drop-shadow-lg">Get in Touch</h1>
      <p className="mb-10 text-lg text-slate-200 font-medium">We'd love to hear from you! Reach out for trek bookings, questions, or partnership opportunities.</p>
      {/* Contact links */}
      <div className="space-y-8">
        {/* Phone link (click to call) */}
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="block text-2xl font-bold text-amber-200 bg-gradient-to-r from-amber-700/80 to-amber-500/80 rounded-full py-4 px-8 shadow-lg hover:from-amber-600/90 hover:to-amber-400/90 transition-colors duration-300 animate-pulse border border-amber-300/40"
        >
          <span className="inline-block align-middle mr-2">📱</span> {phone}
        </a>
        {/* Email link (opens Gmail compose) */}
        <a
          href={gmailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-2xl font-bold text-sky-100 bg-gradient-to-r from-sky-700/80 to-sky-500/80 rounded-full py-4 px-8 shadow-lg hover:from-sky-600/90 hover:to-sky-400/90 transition-colors duration-300 animate-pulse border border-sky-300/40"
        >
          <span className="inline-block align-middle mr-2">✉️</span> {email}
        </a>
      </div>
    </div>
  </section>
);

export default ContactUs;
