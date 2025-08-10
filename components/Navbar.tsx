'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="w-full absolute top-0 left-0 z-30 text-white mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden relative">
              <Image
                src="/logo.webp"
                alt="HotelEase Logo"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 48px, 56px"
                priority
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">HotelEase</h1>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 text-base sm:text-lg">
            <li>
              <Link
                href="/cabins"
                className="hover:text-amber-300 transition-colors duration-200"
              >
                Cabins
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-amber-300 transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/guest-area"
                className="hover:text-amber-300 transition-colors duration-200"
              >
                Guest Area
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-[#141C24]/95 backdrop-blur-md rounded-lg mt-2 p-4 absolute w-full left-0 shadow-lg border border-slate-700">
            <ul className="flex flex-col space-y-4 text-lg">
              <li>
                <Link
                  href="/cabins"
                  className="block hover:text-amber-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cabins
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block hover:text-amber-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/guest-area"
                  className="block hover:text-amber-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Guest Area
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