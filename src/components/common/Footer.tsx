
import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-4 border-t border-cyber-neon-blue/20 bg-cyber-gray-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} <span className="neon-text">Cyber</span>
              <span className="neon-text-blue">Salary</span>
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-cyber-neon-purple">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-cyber-neon-blue">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-cyber-neon-pink">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
