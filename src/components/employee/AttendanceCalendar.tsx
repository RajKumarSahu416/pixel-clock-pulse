
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

type AttendanceType = 'present' | 'absent' | 'leave' | 'holiday' | 'weekend' | 'none';

interface DayData {
  date: number;
  attendance: AttendanceType;
  checkInTime?: string;
  checkOutTime?: string;
}

const AttendanceCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Mock attendance data
  const generateMockData = (): DayData[] => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const data: DayData[] = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const day = date.getDay(); // 0 is Sunday, 6 is Saturday
      
      let attendance: AttendanceType = 'none';
      let checkInTime: string | undefined;
      let checkOutTime: string | undefined;
      
      // Weekends
      if (day === 0 || day === 6) {
        attendance = 'weekend';
      } 
      // Holiday (just for demo - marking 15th as a holiday)
      else if (i === 15) {
        attendance = 'holiday';
      }
      // Random attendance for past days
      else if (date < new Date()) {
        const random = Math.random();
        if (random < 0.7) {
          attendance = 'present';
          checkInTime = '09:00 AM';
          checkOutTime = '06:00 PM';
        } else if (random < 0.9) {
          attendance = 'leave';
        } else {
          attendance = 'absent';
        }
      }
      
      data.push({ date: i, attendance, checkInTime, checkOutTime });
    }
    
    return data;
  };
  
  const attendanceData = generateMockData();
  
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
  
  const renderWeekdays = () => {
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
  
  const renderDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0-6 (Sun-Sat)
    const daysInMonth = attendanceData.length;
    
    // Create an array to represent all cells in the calendar (including empty ones)
    const calendarDays: (DayData | null)[] = Array(firstDayOfMonth).fill(null);
    
    // Add the actual days
    attendanceData.forEach(day => {
      calendarDays.push(day);
    });
    
    // Function to get the color based on attendance type
    const getAttendanceStyle = (type: AttendanceType): string => {
      switch (type) {
        case 'present':
          return 'bg-cyber-neon-blue/10 border-cyber-neon-blue text-white';
        case 'absent':
          return 'bg-cyber-neon-pink/10 border-cyber-neon-pink text-white';
        case 'leave':
          return 'bg-cyber-neon-orange/10 border-cyber-neon-orange text-white';
        case 'holiday':
          return 'bg-cyber-neon-purple/10 border-cyber-neon-purple text-white';
        case 'weekend':
          return 'bg-cyber-gray-700/50 text-gray-400';
        default:
          return 'bg-cyber-gray-800/50 text-gray-400';
      }
    };
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
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
        ))}
      </div>
    );
  };
  
  return (
    <div className="cyber-panel p-6">
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
      
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {renderWeekdays()}
          {renderDays()}
        </div>
      </div>
      
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
    </div>
  );
};

export default AttendanceCalendar;
