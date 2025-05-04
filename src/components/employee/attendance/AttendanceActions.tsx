
import React from 'react';
import { Check, X } from 'lucide-react';

interface AttendanceActionsProps {
  image: string | null;
  checkedIn: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onRetake: () => void;
}

const AttendanceActions: React.FC<AttendanceActionsProps> = ({ 
  image, 
  checkedIn, 
  onCheckIn, 
  onCheckOut, 
  onRetake 
}) => {
  if (!image) {
    return null;
  }

  return (
    <>
      <button 
        onClick={!checkedIn ? onCheckIn : onCheckOut}
        className="cyber-button"
      >
        <Check size={18} className="inline mr-1" />
        {!checkedIn ? "Check In" : "Check Out"}
      </button>
      <button 
        onClick={onRetake}
        className="cyber-button cyber-button-pink"
      >
        <X size={18} className="inline mr-1" />
        Retake
      </button>
    </>
  );
};

export default AttendanceActions;
