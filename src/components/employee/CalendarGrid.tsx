
import React from 'react';
import { DayData } from './types/calendar-types';
import CalendarDay from './CalendarDay';

interface CalendarGridProps {
  attendanceData: DayData[];
  currentYear: number;
  currentMonth: number;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ attendanceData, currentYear, currentMonth }) => {
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0-6 (Sun-Sat)
  
  // Create an array to represent all cells in the calendar (including empty ones)
  const calendarDays: (DayData | null)[] = Array(firstDayOfMonth).fill(null);
  
  // Add the actual days
  attendanceData.forEach(day => {
    calendarDays.push(day);
  });
  
  return (
    <div className="grid grid-cols-7 gap-1">
      {calendarDays.map((day, index) => (
        <CalendarDay key={index} day={day} index={index} />
      ))}
    </div>
  );
};

export default CalendarGrid;
