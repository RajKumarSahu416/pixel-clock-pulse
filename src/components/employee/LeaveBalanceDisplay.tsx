
import React from 'react';
import { LeaveBalance } from './types/leave-types';

interface LeaveBalanceDisplayProps {
  leaveBalance: LeaveBalance[];
}

const LeaveBalanceDisplay: React.FC<LeaveBalanceDisplayProps> = ({ leaveBalance }) => {
  return (
    <div className="space-y-4">
      {leaveBalance.length > 0 ? (
        leaveBalance.map((leave) => (
          <div key={leave.id} className="bg-cyber-gray-900/50 p-3 rounded border border-cyber-neon-blue/20">
            <h4 className="text-sm font-medium">{leave.type}</h4>
            <div className="mt-2 h-2 bg-cyber-gray-800 rounded overflow-hidden">
              <div 
                className="h-full bg-cyber-neon-blue" 
                style={{ width: `${(leave.used_days / leave.total_days) * 100}%` }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span>Used: {leave.used_days}</span>
              <span className="text-cyber-neon-blue">Remaining: {leave.remaining}</span>
              <span>Total: {leave.total_days}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="p-3 text-center text-gray-400">
          <p>No leave balance data available</p>
        </div>
      )}
    </div>
  );
};

export default LeaveBalanceDisplay;
