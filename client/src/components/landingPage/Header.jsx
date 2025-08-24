import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white"><img  width="120px" src="/CyberLink.png" className='pt-5'/></div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#courses" className="text-gray-300 hover:text-white transition-colors">Courses</a>
            <a  href="/#faqsection" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
            <a onClick={() => navigate('/validator')} className="text-gray-300 hover:text-white transition-colors cursor-pointer">Verify Certificate</a>
          </nav>

          {/* Desktop Login Button Only */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogin}
              className="flex-1 py-2 px-6 cursor-pointer text-center bg-white text-purple-600 border border-purple-600 rounded-md shadow hover:bg-gray-400 transition"
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
            <a href="#home" className="block py-2 text-gray-300 hover:text-white">Home</a>
            <a href="#courses" className="block py-2 text-gray-300 hover:text-white">About</a>
            <a href="#about" className="block py-2 text-gray-300 hover:text-white">Courses</a>
            <a href="#contact" className="block py-2 text-gray-300 hover:text-white">Blog</a>
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
