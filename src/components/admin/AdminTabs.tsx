
import React from 'react';
import { User, Calendar, FileText, DollarSign, Users } from 'lucide-react';

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-8 flex flex-wrap border-b border-cyber-neon-purple/20">
      <button 
        className={`px-4 py-2 m-2 ${
          activeTab === 'dashboard' 
            ? 'bg-cyber-neon-purple/10 border-b-2 border-cyber-neon-purple text-white' 
            : 'text-gray-400 hover:text-cyber-neon-blue'
        }`}
        onClick={() => onTabChange('dashboard')}
      >
        <User size={16} className="inline mr-1" />
        Dashboard
      </button>
      <button 
        className={`px-4 py-2 m-2 ${
          activeTab === 'employees' 
            ? 'bg-cyber-neon-blue/10 border-b-2 border-cyber-neon-blue text-white' 
            : 'text-gray-400 hover:text-cyber-neon-blue'
        }`}
        onClick={() => onTabChange('employees')}
      >
        <Users size={16} className="inline mr-1" />
        Employees
      </button>
      <button 
        className={`px-4 py-2 m-2 ${
          activeTab === 'attendance' 
            ? 'bg-cyber-neon-blue/10 border-b-2 border-cyber-neon-blue text-white' 
            : 'text-gray-400 hover:text-cyber-neon-blue'
        }`}
        onClick={() => onTabChange('attendance')}
      >
        <Calendar size={16} className="inline mr-1" />
        Attendance
      </button>
      <button 
        className={`px-4 py-2 m-2 ${
          activeTab === 'leave' 
            ? 'bg-cyber-neon-pink/10 border-b-2 border-cyber-neon-pink text-white' 
            : 'text-gray-400 hover:text-cyber-neon-blue'
        }`}
        onClick={() => onTabChange('leave')}
      >
        <FileText size={16} className="inline mr-1" />
        Leave
      </button>
      <button 
        className={`px-4 py-2 m-2 ${
          activeTab === 'payroll' 
            ? 'bg-cyber-neon-orange/10 border-b-2 border-cyber-neon-orange text-white' 
            : 'text-gray-400 hover:text-cyber-neon-blue'
        }`}
        onClick={() => onTabChange('payroll')}
      >
        <DollarSign size={16} className="inline mr-1" />
        Payroll
      </button>
    </div>
  );
};

export default AdminTabs;
