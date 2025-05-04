
import { DayData, AttendanceType } from '../types/calendar-types';

export const generateMockData = (currentYear: number, currentMonth: number): DayData[] => {
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

export const getAttendanceStyle = (type: AttendanceType): string => {
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
