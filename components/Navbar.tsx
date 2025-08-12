'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="w-full absolute top-0 left-0 z-30 text-white mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden relative">
              <Image
                src="/logo.webp"
                alt="HotelEase Logo"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 56px"
                priority
              />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">HotelEase</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <ul className="flex space-x-6 lg:space-x-8 text-base lg:text-lg">
              <li>
                <Link
                  href="/cabins"
                  className="hover:text-amber-300 transition-colors duration-200 px-2 py-1"
                >
                  Cabins
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-amber-300 transition-colors duration-200 px-2 py-1"
                >
                  About
                </Link>
              </li>

              {/* Unified Guest Area Link (with image + label) */}
              <li>
                <Link
                  href="/guest-area"
                  className="flex items-center gap-2 hover:text-amber-300 transition-colors duration-200 pl-6 border-l border-slate-600"
                >
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {session?.user?.name?.[0]?.toUpperCase() ||
                        session?.user?.email?.[0]?.toUpperCase() ||
                        '👤'}
                    </div>
                  )}
                  <span className="text-sm lg:text-base hidden xl:block">Guest Area</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#141C24]/95 backdrop-blur-md rounded-lg mt-2 mx-4 overflow-hidden shadow-lg border border-slate-700">
            <ul className="flex flex-col space-y-1 text-base">
              <li>
                <Link
                  href="/cabins"
                  className="block px-4 py-3 hover:bg-white/10 hover:text-amber-300 transition-colors"
                  onClick={toggleMenu}
                >
                  Cabins
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block px-4 py-3 hover:bg-white/10 hover:text-amber-300 transition-colors"
                  onClick={toggleMenu}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/guest-area"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 hover:text-amber-300 transition-colors border-t border-slate-600"
                  onClick={toggleMenu}
                >
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {session?.user?.name?.[0]?.toUpperCase() ||
                        session?.user?.email?.[0]?.toUpperCase() ||
                        '👤'}
                    </div>
                  )}
                  <span>Guest Area</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;