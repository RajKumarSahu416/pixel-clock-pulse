
import React from 'react';
import { Check, X } from 'lucide-react';

interface LeaveRequest {
  id: string;
  employee: string;
  type: string;
  duration: string;
  reason: string;
}

const PendingLeaveRequests = () => {
  // Mock leave approval data
  const pendingLeaves: LeaveRequest[] = [
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

  return (
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
  );
};

export default PendingLeaveRequests;
