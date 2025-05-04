
import React from 'react';
import { BarChart } from 'lucide-react';

interface MonthData {
  present: number;
  absent: number;
  leave: number;
  total: number;
}

const MonthlyAttendanceChart = () => {
  // Mock attendance data for the month
  const monthData: MonthData = {
    present: 1820,
    absent: 155,
    leave: 225,
    total: 2200,
  };

  return (
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
  );
};

export default MonthlyAttendanceChart;
