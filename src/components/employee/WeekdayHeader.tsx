
import React from 'react';

const WeekdayHeader: React.FC = () => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="grid grid-cols-7 gap-1 mb-1 text-sm text-cyber-neon-blue">
      {weekdays.map((day, index) => (
        <div 
          key={day} 
          className={`py-2 text-center border-b ${
            index === 0 || index === 6 ? 'border-cyber-neon-pink/30' : 'border-cyber-neon-blue/30'
          }`}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default WeekdayHeader;
