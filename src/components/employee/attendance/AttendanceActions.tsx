
import React from 'react';
import { Check, RotateCcw, X } from 'lucide-react';

interface AttendanceActionsProps {
  image: string;
  checkedIn: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onRetake: () => void;
  uploading: boolean;
}

const AttendanceActions: React.FC<AttendanceActionsProps> = ({ 
  image, 
  checkedIn, 
  onCheckIn, 
  onCheckOut, 
  onRetake,
  uploading
}) => {
  return (
    <div className="w-full flex flex-wrap justify-center gap-2">
      {!checkedIn ? (
        <button
          onClick={onCheckIn}
          className="cyber-button flex items-center gap-2"
          disabled={uploading}
        >
          <Check size={16} />
          Check In with Photo
        </button>
      ) : (
        <button
          onClick={onCheckOut}
          className="cyber-button-pink flex items-center gap-2"
          disabled={uploading}
        >
          <X size={16} />
          Check Out with Photo
        </button>
      )}
      
      <button
        onClick={onRetake}
        className="cyber-button-sm bg-cyber-gray-800 flex items-center gap-2"
        disabled={uploading}
      >
        <RotateCcw size={16} />
        Retake
      </button>
    </div>
  );
};

export default AttendanceActions;
