
import React from 'react';
import { LeaveRequest } from './types/leave-types';

interface RecentLeaveRequestsProps {
  recentRequests: LeaveRequest[];
}

const RecentLeaveRequests: React.FC<RecentLeaveRequestsProps> = ({ recentRequests }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status class based on status value
  const getStatusClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500/20 text-green-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      case 'pending':
      default:
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };
  
  // Get border class based on status value
  const getBorderClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return 'border-cyber-neon-blue/30 bg-cyber-neon-blue/5';
      case 'rejected':
        return 'border-cyber-neon-pink/30 bg-cyber-neon-pink/5';
      case 'pending':
      default:
        return 'border-cyber-neon-orange/30 bg-cyber-neon-orange/5';
    }
  };
  
  return (
    <div className="space-y-2">
      {recentRequests.length > 0 ? (
        recentRequests.map((request) => (
          <div key={request.id} className={`p-3 border rounded ${getBorderClass(request.status)}`}>
            <div className="flex justify-between">
              <span className="text-sm font-medium">{request.leave_type}</span>
              <span className={`text-xs px-2 py-1 ${getStatusClass(request.status)} rounded`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(request.start_date)} - {formatDate(request.end_date)}
            </p>
          </div>
        ))
      ) : (
        <div className="p-3 text-center text-gray-400">
          <p>No recent leave requests</p>
        </div>
      )}
    </div>
  );
};

export default RecentLeaveRequests;
