
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Calendar, FileText, LogOut } from 'lucide-react';

const Navbar = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // In a real app, we would handle logout with Supabase here
    console.log('Logging out...');
    navigate('/');
  };

  const employeeLinks = [
    { name: 'Dashboard', path: '/employee', icon: <User size={18} /> },
    { name: 'Attendance', path: '/employee/attendance', icon: <Calendar size={18} /> },
    { name: 'Leave', path: '/employee/leave', icon: <FileText size={18} /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: <User size={18} /> },
    { name: 'Employees', path: '/admin/employees', icon: <User size={18} /> },
    { name: 'Attendance', path: '/admin/attendance', icon: <Calendar size={18} /> },
    { name: 'Leave', path: '/admin/leave', icon: <FileText size={18} /> },
    { name: 'Payroll', path: '/admin/payroll', icon: <FileText size={18} /> },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <nav className="bg-cyber-gray-900/90 border-b border-cyber-neon-purple/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to={isAdmin ? "/admin" : "/employee"} className="flex items-center">
                <span className="neon-text text-xl font-bold">Cyber</span>
                <span className="neon-text-blue text-xl font-bold">Salary</span>
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-cyber-neon-purple border-b-2 border-cyber-neon-purple'
                      : 'text-gray-300 hover:text-cyber-neon-blue'
                  } flex items-center gap-1`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-cyber-neon-pink px-3 py-2 text-sm font-medium flex items-center gap-1"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-cyber-neon-blue"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-cyber-gray-800 bg-opacity-95 backdrop-blur-sm border-b border-cyber-neon-purple/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-cyber-neon-purple border-l-2 border-cyber-neon-purple pl-2'
                    : 'text-gray-300 hover:text-cyber-neon-blue'
                } flex items-center gap-2`}
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full text-left text-gray-300 hover:text-cyber-neon-pink px-3 py-2 text-base font-medium flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
