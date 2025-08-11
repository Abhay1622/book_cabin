// components/AboutUs.tsx
import Link from 'next/link';
import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section className="bg-[#141C24]  py-25">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-300 leading-tight">
            Welcome to <span className="text-blue-600">HotelEase</span>
          </h1>
          <p className="mt-4 text-lg text-white max-w-3xl mx-auto">
            Discover the perfect blend of luxury, comfort, and nature. We bring you handpicked luxury cabins in serene locations, 
            designed for unforgettable getaways.
          </p>
          <div className="mt-8 w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-300 mb-4">Our Mission</h2>
            <p className="text-white leading-relaxed">
              To redefine modern travel by offering seamless access to premium cabin stays in breathtaking locations. 
              We believe every journey should begin with comfort, trust, and ease.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Curated luxury cabin experiences",
                "Secure, instant booking process",
                "24/7 guest support & easy cancellations",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center text-gray-200">
                  <span className="text-blue-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Luxury Cabin in Nature"
              className="rounded-xl shadow-lg object-cover w-full h-64 md:h-80"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className=" py-12 px-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-gray-300 mb-10">Why Choose HotelEase?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Handpicked Cabins",
                desc: "Each cabin is carefully selected for quality, comfort, and scenic beauty.",
                icon: "🏠",
              },
              {
                title: "Seamless Booking",
                desc: "Book your dream stay in minutes with our intuitive, secure platform.",
                icon: "🔒",
              },
              {
                title: "Real-Time Availability",
                desc: "No more guesswork — see live availability and instant confirmations.",
                icon: "📅",
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">{feature.title}</h3>
                <p className="text-white">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Link href={'/cabins'}>
        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">Ready to Escape?</h2>
          <p className="text-white mb-6">Find your perfect cabin and book your next adventure today.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Explore Cabins
          </button>
        </div>
        </Link>
      </div>
    </section>
  );
};

export default AboutUs;