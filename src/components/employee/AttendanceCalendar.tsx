
import React, { useState } from 'react';
import { generateMockData } from './utils/calendar-utils';
import CalendarHeader from './CalendarHeader';
import WeekdayHeader from './WeekdayHeader';
import CalendarGrid from './CalendarGrid';
import CalendarLegend from './CalendarLegend';

const AttendanceCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const attendanceData = generateMockData(currentYear, currentMonth);
  
  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  return (
    <div className="cyber-panel p-6">
      <CalendarHeader 
        currentMonth={currentMonth}
        currentYear={currentYear}
        previousMonth={previousMonth}
        nextMonth={nextMonth}
      />
      
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <WeekdayHeader />
          <CalendarGrid 
            attendanceData={attendanceData}
            currentYear={currentYear}
            currentMonth={currentMonth}
          />
        </div>
      </div>
      
      <CalendarLegend />
    </div>
  );
};

export default AttendanceCalendar;
