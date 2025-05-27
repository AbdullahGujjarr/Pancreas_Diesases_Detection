import React from 'react';
import { Activity, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2">
              <Activity className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">PancreScan AI</span>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Advanced AI-powered pancreatic disease detection system. Our platform analyzes medical 
              imaging to help detect and diagnose pancreatic conditions with high precision.
            </p>
          </div>

          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-primary transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/upload" className="text-gray-400 hover:text-primary transition-colors duration-200">
                  Upload Scan
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-200">
                  About Technology
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-200">
                  For Medical Professionals
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Contact Us</h3>
            <p className="text-gray-400 mb-2">Have questions or need support?</p>
            <a href="mailto:support@pancrescanai.com" className="text-primary hover:text-primary/80 transition-colors duration-200">
              support@pancrescanai.com
            </a>
            
            <div className="mt-6">
              <p className="text-gray-400 text-sm">
                For medical emergencies, please contact your healthcare provider or emergency services directly.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} PancreScan AI. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0 flex items-center">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for advancing healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;