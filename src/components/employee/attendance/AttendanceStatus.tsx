
import React from 'react';

interface AttendanceStatusProps {
  checkedIn: boolean;
}

const AttendanceStatus: React.FC<AttendanceStatusProps> = ({ checkedIn }) => {
  return (
    <div className="mt-4 w-full max-w-md">
      <div className="bg-cyber-gray-900/50 rounded border border-cyber-neon-blue/20 p-4">
        <h3 className="text-cyber-neon-blue text-lg mb-2">Today's Status</h3>
        <p className="text-sm text-gray-300">
          {checkedIn ? (
            <>
              <span className="text-green-400">✓ Checked in</span> at 09:00 AM
            </>
          ) : (
            "Not checked in yet"
          )}
        </p>
      </div>
    </div>
  );
};

export default AttendanceStatus;
