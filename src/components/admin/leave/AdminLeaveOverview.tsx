
import React from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

interface AdminLeaveOverviewProps {
  leaveRequests: any[];
}

const AdminLeaveOverview: React.FC<AdminLeaveOverviewProps> = ({ leaveRequests }) => {
  const pendingCount = leaveRequests.filter(r => r.status === 'pending').length;
  const approvedCount = leaveRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = leaveRequests.filter(r => r.status === 'rejected').length;
  const totalCount = leaveRequests.length;

  const stats = [
    { 
      title: 'Pending Requests', 
      value: pendingCount, 
      icon: <Clock size={24} className="text-cyber-neon-orange" />,
      color: 'border-cyber-neon-orange/30'
    },
    { 
      title: 'Approved Leaves', 
      value: approvedCount, 
      icon: <CheckCircle size={24} className="text-green-500" />,
      color: 'border-green-500/30'
    },
    { 
      title: 'Rejected Requests', 
      value: rejectedCount, 
      icon: <XCircle size={24} className="text-red-500" />,
      color: 'border-red-500/30'
    },
    { 
      title: 'Total Requests', 
      value: totalCount, 
      icon: <FileText size={24} className="text-cyber-neon-blue" />,
      color: 'border-cyber-neon-blue/30'
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Leave Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`p-4 rounded-md border ${stat.color} bg-cyber-gray-900/50`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm text-gray-400">{stat.title}</h3>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLeaveOverview;
