
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { User, Calendar, FileText, DollarSign, Users, CheckCircle, Clock, X, Check, BarChart } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mock summary data
  const summaryData = [
    { title: 'Total Employees', value: 125, icon: <Users size={24} />, color: 'cyber-neon-blue', change: '+8% from last month' },
    { title: 'Present Today', value: 112, icon: <CheckCircle size={24} />, color: 'cyber-neon-purple', change: '89.6% attendance rate' },
    { title: 'On Leave', value: 8, icon: <Calendar size={24} />, color: 'cyber-neon-orange', change: '6.4% of workforce' },
    { title: 'Pending Requests', value: 15, icon: <Clock size={24} />, color: 'cyber-neon-pink', change: '12 leave, 3 attendance' },
  ];
  
  // Mock recent activities
  const recentActivities = [
    { user: 'Sarah Johnson', action: 'marked attendance', time: '9:02 AM', image: 'https://source.unsplash.com/random/40x40/?woman' },
    { user: 'Michael Chen', action: 'requested sick leave', time: '8:45 AM', image: 'https://source.unsplash.com/random/40x40/?man' },
    { user: 'Emily Brown', action: 'checked out', time: 'Yesterday, 6:15 PM', image: 'https://source.unsplash.com/random/40x40/?woman' },
    { user: 'Robert Singh', action: 'leave approved by you', time: 'Yesterday, 2:30 PM', image: 'https://source.unsplash.com/random/40x40/?man' },
  ];
  
  // Mock leave approval data
  const pendingLeaves = [
    { 
      id: 'L-2025-042', 
      employee: 'Alex Jensen', 
      type: 'Sick Leave', 
      duration: 'Apr 10 - Apr 12, 2025 (3 days)', 
      reason: 'Medical appointment and recovery' 
    },
    { 
      id: 'L-2025-043', 
      employee: 'Maria Garcia', 
      type: 'Casual Leave', 
      duration: 'Apr 15, 2025 (1 day)', 
      reason: 'Personal errands' 
    },
    { 
      id: 'L-2025-044', 
      employee: 'John Smith', 
      type: 'Paid Leave', 
      duration: 'Apr 18 - Apr 24, 2025 (5 days)', 
      reason: 'Family vacation'
    },
  ];
  
  // Mock attendance data for the month
  const monthData = {
    present: 1820,
    absent: 155,
    leave: 225,
    total: 2200,
  };
  
  // Mock payroll data
  const payrollSummary = {
    totalSalary: '$284,500',
    averageSalary: '$2,276',
    highestPaid: '$8,500',
    lowestPaid: '$1,200',
  };
  
  // Render dashboard section
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item, index) => (
          <div key={index} className="cyber-panel p-5 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full bg-${item.color}`}></div>
            <div className="flex items-start">
              <div className={`p-3 rounded-lg bg-${item.color}/10 text-${item.color}`}>
                {item.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-400">{item.title}</h3>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-gray-500 mt-1">{item.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Attendance */}
        <div className="cyber-panel p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <BarChart size={20} className="mr-2 text-cyber-neon-blue" />
            <span className="neon-text-blue">Monthly</span> Attendance
          </h2>
          
          <div className="space-y-4">
            <div className="h-12 bg-cyber-gray-900 rounded-md overflow-hidden flex">
              <div 
                className="h-full bg-cyber-neon-blue flex items-center justify-center text-xs font-medium" 
                style={{ width: `${(monthData.present / monthData.total) * 100}%` }}
              >
                {Math.round((monthData.present / monthData.total) * 100)}%
              </div>
              <div 
                className="h-full bg-cyber-neon-orange flex items-center justify-center text-xs font-medium" 
                style={{ width: `${(monthData.leave / monthData.total) * 100}%` }}
              >
                {Math.round((monthData.leave / monthData.total) * 100)}%
              </div>
              <div 
                className="h-full bg-cyber-neon-pink flex items-center justify-center text-xs font-medium"
                style={{ width: `${(monthData.absent / monthData.total) * 100}%` }}
              >
                {Math.round((monthData.absent / monthData.total) * 100)}%
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-cyber-gray-900/50 border border-cyber-neon-blue/30 rounded">
                <div className="text-cyber-neon-blue text-lg font-bold">{monthData.present}</div>
                <div className="text-xs text-gray-400">Present</div>
              </div>
              <div className="p-3 bg-cyber-gray-900/50 border border-cyber-neon-orange/30 rounded">
                <div className="text-cyber-neon-orange text-lg font-bold">{monthData.leave}</div>
                <div className="text-xs text-gray-400">On Leave</div>
              </div>
              <div className="p-3 bg-cyber-gray-900/50 border border-cyber-neon-pink/30 rounded">
                <div className="text-cyber-neon-pink text-lg font-bold">{monthData.absent}</div>
                <div className="text-xs text-gray-400">Absent</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payroll Summary */}
        <div className="cyber-panel p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <DollarSign size={20} className="mr-2 text-cyber-neon-purple" />
            <span className="neon-text">Payroll</span> Summary
          </h2>
          
          <div className="space-y-4">
            <div className="p-3 bg-cyber-gray-900/80 rounded flex justify-between items-center border-l-4 border-cyber-neon-purple">
              <span className="text-gray-400">Total Salary</span>
              <span className="text-lg font-bold">{payrollSummary.totalSalary}</span>
            </div>
            <div className="p-3 bg-cyber-gray-900/60 rounded flex justify-between items-center border-l-2 border-cyber-neon-purple/80">
              <span className="text-gray-400">Average</span>
              <span className="font-medium">{payrollSummary.averageSalary}</span>
            </div>
            <div className="p-3 bg-cyber-gray-900/60 rounded flex justify-between items-center border-l-2 border-cyber-neon-blue/80">
              <span className="text-gray-400">Highest</span>
              <span className="font-medium text-cyber-neon-blue">{payrollSummary.highestPaid}</span>
            </div>
            <div className="p-3 bg-cyber-gray-900/60 rounded flex justify-between items-center border-l-2 border-cyber-neon-pink/80">
              <span className="text-gray-400">Lowest</span>
              <span className="font-medium text-cyber-neon-pink">{payrollSummary.lowestPaid}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="cyber-panel p-6">
          <h2 className="text-xl font-bold mb-6 neon-text-blue">Recent Activity</h2>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center p-3 bg-cyber-gray-900/30 rounded border border-cyber-neon-blue/10 hover:border-cyber-neon-blue/30 transition-colors">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-cyber-neon-blue/30">
                  <img src={activity.image} alt={activity.user} className="w-full h-full object-cover" />
                </div>
                <div className="ml-4">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
            
            <button className="w-full py-2 text-sm text-cyber-neon-blue hover:text-cyber-neon-purple">
              View All Activity →
            </button>
          </div>
        </div>
        
        {/* Pending Leave Requests */}
        <div className="cyber-panel p-6">
          <h2 className="text-xl font-bold mb-6 neon-text-pink">Pending Leave Requests</h2>
          
          <div className="space-y-4">
            {pendingLeaves.map((leave, index) => (
              <div key={index} className="p-3 bg-cyber-gray-900/30 rounded border border-cyber-neon-pink/10 hover:border-cyber-neon-pink/30 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{leave.employee}</h3>
                    <p className="text-xs text-gray-400">{leave.type} • {leave.id}</p>
                    <p className="text-xs text-gray-400 mt-1">{leave.duration}</p>
                    <p className="text-xs mt-2 bg-cyber-gray-800 p-1 rounded">{leave.reason}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1.5 bg-green-500/10 border border-green-500/30 rounded text-green-400 hover:bg-green-500/20">
                      <Check size={16} />
                    </button>
                    <button className="p-1.5 bg-red-500/10 border border-red-500/30 rounded text-red-400 hover:bg-red-500/20">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-2 text-sm text-cyber-neon-pink hover:text-cyber-neon-purple">
              View All Requests →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAdmin={true} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Admin breadcrumb/header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400">Manage employees, attendance, leave and payroll</p>
        </div>
        
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
            <User size={16} className="inline mr-1" />
            Dashboard
          </button>
          <button 
            className={`px-4 py-2 m-2 ${
              activeTab === 'employees' 
                ? 'bg-cyber-neon-blue/10 border-b-2 border-cyber-neon-blue text-white' 
                : 'text-gray-400 hover:text-cyber-neon-blue'
            }`}
            onClick={() => setActiveTab('employees')}
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
            onClick={() => setActiveTab('attendance')}
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
            onClick={() => setActiveTab('leave')}
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
            onClick={() => setActiveTab('payroll')}
          >
            <DollarSign size={16} className="inline mr-1" />
            Payroll
          </button>
        </div>
        
        {/* Content based on active tab */}
        <div>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'employees' && (
            <div className="cyber-panel p-8 text-center">
              <h2 className="text-2xl font-bold text-cyber-neon-blue mb-4">Employees Management</h2>
              <p className="text-gray-400 mb-6">This feature will be available in Phase 2</p>
              <div className="w-16 h-16 mx-auto">
                <Users className="w-full h-full text-cyber-neon-blue opacity-50" />
              </div>
            </div>
          )}
          {activeTab === 'attendance' && (
            <div className="cyber-panel p-8 text-center">
              <h2 className="text-2xl font-bold text-cyber-neon-blue mb-4">Attendance Management</h2>
              <p className="text-gray-400 mb-6">This feature will be available in Phase 2</p>
              <div className="w-16 h-16 mx-auto">
                <Calendar className="w-full h-full text-cyber-neon-blue opacity-50" />
              </div>
            </div>
          )}
          {activeTab === 'leave' && (
            <div className="cyber-panel p-8 text-center">
              <h2 className="text-2xl font-bold text-cyber-neon-pink mb-4">Leave Management</h2>
              <p className="text-gray-400 mb-6">This feature will be available in Phase 2</p>
              <div className="w-16 h-16 mx-auto">
                <FileText className="w-full h-full text-cyber-neon-pink opacity-50" />
              </div>
            </div>
          )}
          {activeTab === 'payroll' && (
            <div className="cyber-panel p-8 text-center">
              <h2 className="text-2xl font-bold text-cyber-neon-orange mb-4">Payroll Management</h2>
              <p className="text-gray-400 mb-6">This feature will be available in Phase 2</p>
              <div className="w-16 h-16 mx-auto">
                <DollarSign className="w-full h-full text-cyber-neon-orange opacity-50" />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
