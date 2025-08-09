import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-row flex-wrap col-12 justify-between lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 ">
            <h3 className="text-xl font-bold">EduGuest</h3>
            <p className="text-gray-400 leading-relaxed">
              We are passionate to build a top of expert instructors,<br/> tutors & mentoring experience.<br/> Start your online learning experience today.
            </p>
            <div className='text-lg font-semibold'>Credits:</div>
            <div className='flex flex-col gap-1'>
              <a className='text-gray-400 hover:text-white' href="https://github.com/sathishsara1" target='_blank'><div>S V S Sathish</div></a>
              <a className="text-gray-400 hover:text-white" href="https://github.com/ballaSAISAMPATH" target='_blank'><div>Sai Sampath</div></a>
              <a className='text-gray-400 hover:text-white' href="https://github.com/vamsikrishnaperuri" target='_blank'><div>Peruri Vamsi Krishna</div></a>    
              <a className='text-gray-400 hover:text-white' href="https://github.com/praveengamini" target='_blank'><div>Praveen Gamini</div></a>
              </div>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Demo</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Become Teacher</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Instructor</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Events</a></li>
            </ul>
          </div>

          <div className="flex flex-col space-x-4">
            <span className='font-bold'>Social media handles:</span>
            <div className='mt-5 flex space-x-4'>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              
            </div>
              
            </div>
    
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 EduGuest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
