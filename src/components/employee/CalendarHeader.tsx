
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentMonth: number;
  currentYear: number;
  previousMonth: () => void;
  nextMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  currentYear,
  previousMonth,
  nextMonth
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold flex items-center">
        <Calendar size={24} className="mr-2 text-cyber-neon-blue" />
        <span className="neon-text-blue">Attendance</span> Calendar
      </h2>
      <div className="flex items-center space-x-4">
        <button 
          onClick={previousMonth}
          className="p-2 rounded-full hover:bg-cyber-neon-purple/10 text-cyber-neon-purple"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-xl">
          {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
        </h3>
        <button 
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-cyber-neon-purple/10 text-cyber-neon-purple"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
