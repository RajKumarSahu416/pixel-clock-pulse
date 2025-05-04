
import React from 'react';
import DashboardSummary from './DashboardSummary';
import MonthlyAttendanceChart from './MonthlyAttendanceChart';
import PayrollSummary from './PayrollSummary';
import RecentActivity from './RecentActivity';
import PendingLeaveRequests from './PendingLeaveRequests';

const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <DashboardSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MonthlyAttendanceChart />
        <PayrollSummary />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <PendingLeaveRequests />
      </div>
    </div>
  );
};

export default DashboardContent;
