import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Calendar, FileText, DollarSign } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import DashboardContent from '../components/admin/DashboardContent';
import PlaceholderContent from '../components/admin/PlaceholderContent';
import AdminTabNavigation from '../components/admin/AdminTabNavigation';
import AdminLeaveManagement from '../components/admin/leave/AdminLeaveManagement';
import AdminAttendanceManagement from '../components/admin/attendance/AdminAttendanceManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Set initial activeTab based on current route
  const getInitialTab = () => {
    const path = location.pathname;
    if (path.includes('/admin/employees')) return 'employees';
    if (path.includes('/admin/attendance')) return 'attendance';
    if (path.includes('/admin/leave')) return 'leave';
    if (path.includes('/admin/payroll')) return 'payroll';
    return 'dashboard';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  
  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Navigate to the appropriate route based on selected tab
    switch(tab) {
      case 'employees':
        navigate('/admin/employees');
        break;
      case 'attendance':
        navigate('/admin/attendance');
        break;
      case 'leave':
        navigate('/admin/leave');
        break;
      case 'payroll':
        navigate('/admin/payroll');
        break;
      default:
        navigate('/admin');
        break;
    }
  };
  
  // Update activeTab when route changes
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);
  
  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'employees':
        return (
          <PlaceholderContent 
            title="Employees Management" 
            icon={<Users className="w-full h-full text-cyber-neon-blue opacity-50" />}
            color="blue"
          />
        );
      case 'attendance':
        return <AdminAttendanceManagement />;
      case 'leave':
        return <AdminLeaveManagement />;
      case 'payroll':
        return (
          <PlaceholderContent 
            title="Payroll Management" 
            icon={<DollarSign className="w-full h-full text-cyber-neon-orange opacity-50" />}
            color="orange"
          />
        );
      default:
        return <DashboardContent />;
    }
  };
  
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
        <AdminTabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        
        {/* Content based on active tab */}
        <div className="cyber-panel p-6">
          {renderContent()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
