
import React from 'react';
import { DayData } from './types/calendar-types';
import { getAttendanceStyle } from './utils/calendar-utils';

interface CalendarDayProps {
  day: DayData | null;
  index: number;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, index }) => {
  return (
    <div 
      key={index} 
      className={`relative p-1 min-h-[80px] border ${
        day ? getAttendanceStyle(day.attendance) : 'bg-cyber-gray-900/30 text-gray-700'
      }`}
    >
      {day && (
        <>
          <div className="text-sm">{day.date}</div>
          {day.attendance === 'present' && (
            <div className="mt-1 text-xs">
              <div className="text-cyber-neon-blue">In: {day.checkInTime}</div>
              <div className="text-cyber-neon-blue">Out: {day.checkOutTime}</div>
            </div>
          )}
          {day.attendance === 'leave' && (
            <div className="mt-1 text-xs text-cyber-neon-orange">Leave</div>
          )}
          {day.attendance === 'holiday' && (
            <div className="mt-1 text-xs text-cyber-neon-purple">Holiday</div>
          )}
        </>
      )}
    </div>
  );
};

export default CalendarDay;
