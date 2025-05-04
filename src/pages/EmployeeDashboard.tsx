
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AttendanceCapture from '../components/employee/AttendanceCapture';
import AttendanceCalendar from '../components/employee/AttendanceCalendar';
import LeaveRequest from '../components/employee/LeaveRequest';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mock user data
  const user = {
    name: 'Alex Jensen',
    role: 'Software Developer',
    department: 'Engineering',
    profileImage: 'https://source.unsplash.com/random/100x100/?portrait',
    joinDate: 'Jan 15, 2025',
  };
  
  // Mock statistics
  const stats = [
    { label: 'Days Present', value: 22, icon: '✓', color: 'cyber-neon-blue' },
    { label: 'Days Absent', value: 2, icon: '✗', color: 'cyber-neon-pink' },
    { label: 'Leave Balance', value: 18, icon: '◷', color: 'cyber-neon-purple' },
    { label: 'Working Hours', value: '176h', icon: '⌚', color: 'cyber-neon-orange' },
  ];
  
  // Dashboard section
  const renderDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile section */}
      <div className="cyber-panel p-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyber-neon-purple mb-4 relative">
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-4 border-cyber-neon-purple/20 rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold neon-text">{user.name}</h2>
          <p className="text-cyber-neon-blue">{user.role}</p>
          <p className="text-gray-400 text-sm">{user.department}</p>
          
          <div className="mt-6 w-full border-t border-cyber-neon-purple/20 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Employee ID</span>
              <span>EMP-4872</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Join Date</span>
              <span>{user.joinDate}</span>
            </div>
          </div>
          
          <button className="cyber-button-blue mt-6 w-full">
            View Profile
          </button>
        </div>
      </div>
      
      {/* Stats and quick actions */}
      <div className="lg:col-span-2 space-y-6">
        <div className="cyber-panel p-6">
          <h2 className="text-xl font-bold mb-4 text-cyber-neon-blue">Monthly Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className={`p-4 bg-cyber-gray-900/50 border border-${stat.color}/30 rounded text-center`}>
                <div className={`text-${stat.color} text-2xl mb-1`}>{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="cyber-panel p-6">
          <h2 className="text-xl font-bold mb-4 text-cyber-neon-blue">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              className="cyber-button"
              onClick={() => setActiveTab('attendance')}
            >
              Mark Attendance
            </button>
            <button 
              className="cyber-button-pink"
              onClick={() => setActiveTab('leave')}
            >
              Request Leave
            </button>
          </div>
        </div>
        
        <div className="cyber-panel p-6">
          <h2 className="text-xl font-bold mb-4 neon-text">Upcoming Holidays</h2>
          <div className="space-y-3">
            <div className="p-3 bg-cyber-gray-900/50 border border-cyber-neon-purple/30 rounded flex justify-between items-center">
              <div>
                <h3 className="font-medium">Memorial Day</h3>
                <p className="text-xs text-gray-400">National Holiday</p>
              </div>
              <div className="text-cyber-neon-purple">May 27, 2025</div>
            </div>
            <div className="p-3 bg-cyber-gray-900/50 border border-cyber-neon-purple/30 rounded flex justify-between items-center">
              <div>
                <h3 className="font-medium">Independence Day</h3>
                <p className="text-xs text-gray-400">National Holiday</p>
              </div>
              <div className="text-cyber-neon-purple">Jul 4, 2025</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAdmin={false} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-8 flex flex-wrap border-b border-cyber-neon-purple/20">
          <button 
            className={`px-4 py-2 m-2 ${
              activeTab === 'dashboard' 
                ? 'bg-cyber-neon-purple/10 border-b-2 border-cyber-neon-purple text-white' 
                : 'text-gray-400 hover:text-cyber-neon-blue'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`px-4 py-2 m-2 ${
              activeTab === 'attendance' 
                ? 'bg-cyber-neon-blue/10 border-b-2 border-cyber-neon-blue text-white' 
                : 'text-gray-400 hover:text-cyber-neon-blue'
            }`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button 
            className={`px-4 py-2 m-2 ${
              activeTab === 'leave' 
                ? 'bg-cyber-neon-pink/10 border-b-2 border-cyber-neon-pink text-white' 
                : 'text-gray-400 hover:text-cyber-neon-blue'
            }`}
            onClick={() => setActiveTab('leave')}
          >
            Leave Management
          </button>
        </div>
        
        {/* Content based on active tab */}
        <div>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'attendance' && (
            <div className="space-y-8">
              <AttendanceCapture />
              <AttendanceCalendar />
            </div>
          )}
          {activeTab === 'leave' && <LeaveRequest />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EmployeeDashboard;
