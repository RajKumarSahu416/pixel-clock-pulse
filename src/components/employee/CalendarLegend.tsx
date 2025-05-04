
import React from 'react';

const CalendarLegend: React.FC = () => {
  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-cyber-neon-blue/10 border border-cyber-neon-blue mr-2"></div>
        <span className="text-sm">Present</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-cyber-neon-pink/10 border border-cyber-neon-pink mr-2"></div>
        <span className="text-sm">Absent</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-cyber-neon-orange/10 border border-cyber-neon-orange mr-2"></div>
        <span className="text-sm">Leave</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-cyber-neon-purple/10 border border-cyber-neon-purple mr-2"></div>
        <span className="text-sm">Holiday</span>
      </div>
    </div>
  );
};

export default CalendarLegend;
