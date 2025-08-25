import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import confetti from 'canvas-confetti';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => navigate('/auth/login');

  function launchConfetti() {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
  }

  // ✅ Common nav links
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/#courses" },
    { label: "FAQ", href: "/#faqsection" },
    { label: "Verify Certificate", onClick: () => navigate('/validator') }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <button onClick={launchConfetti} className="font-bold text-white cursor-pointer">
              <img width="120px" src="/CyberLink.png" className="p-2" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, i) =>
              link.onClick ? (
                <span
                  key={i}
                  onClick={link.onClick}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  {link.label}
                </span>
              ) : (
                <a
                  key={i}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Desktop Login Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogin}
              className="flex-1 py-2 px-6 text-center cursor-pointer bg-white text-purple-600 border border-purple-600 rounded-md shadow hover:bg-gray-400 transition"
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="px-4 py-2 space-y-2">
            {navLinks.map((link, i) =>
              link.onClick ? (
                <span
                  key={i}
                  onClick={() => {
                    link.onClick();
                    setIsMenuOpen(false); // close menu after click
                  }}
                  className="block py-2 text-gray-300 hover:text-white cursor-pointer"
                >
                  {link.label}
                </span>
              ) : (
                <a
                  key={i}
                  href={link.href}
                  className="block py-2 text-gray-300 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              )
            )}
            <div className="pt-2">
              <button
                onClick={handleLogin}
                className="flex-1 py-2 px-4 text-center bg-white text-purple-600 border border-purple-600 rounded-xl shadow hover:bg-gray-100 transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


export default Header;
