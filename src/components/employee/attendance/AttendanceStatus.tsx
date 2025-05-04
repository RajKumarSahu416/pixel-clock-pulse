
import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface AttendanceStatusProps {
  checkedIn: boolean;
  checkInTime?: string;
  checkOutTime?: string;
}

const AttendanceStatus: React.FC<AttendanceStatusProps> = ({ 
  checkedIn, 
  checkInTime = '09:00 AM',
  checkOutTime
}) => {
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    
    // If it's already formatted like "09:00 AM", return as is
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    
    // If it's a timestamp, format it
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString; // Return original if parsing fails
    }
  };

  return (
    <div className="mt-4 w-full max-w-md">
      <div className="bg-cyber-gray-900/50 rounded border border-cyber-neon-blue/20 p-4">
        <h3 className="text-cyber-neon-blue text-lg mb-2">Today's Status</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300 flex items-center">
              {checkedIn ? (
                <CheckCircle size={16} className="text-green-400 mr-2" />
              ) : (
                <XCircle size={16} className="text-red-400 mr-2" />
              )}
              Check-in Status
            </span>
            <span className={checkedIn ? "text-green-400" : "text-red-400"}>
              {checkedIn ? "Present" : "Not Checked In"}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300 flex items-center">
              <Clock size={16} className="text-cyber-neon-blue mr-2" />
              Check-in Time
            </span>
            <span>
              {checkedIn ? formatTime(checkInTime) : "-"}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300 flex items-center">
              <Clock size={16} className="text-cyber-neon-purple mr-2" />
              Check-out Time
            </span>
            <span>
              {checkOutTime ? formatTime(checkOutTime) : "-"}
            </span>
          </div>
          
          {checkedIn && !checkOutTime && (
            <div className="mt-3 text-xs text-gray-400 border-t border-cyber-neon-blue/10 pt-2">
              Remember to check-out before leaving for the day
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceStatus;
