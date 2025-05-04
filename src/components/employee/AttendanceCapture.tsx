
import React from 'react';
import { Check, Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CameraCapture from './attendance/CameraCapture';
import CameraDisplay from './attendance/CameraDisplay';
import AttendanceActions from './attendance/AttendanceActions';
import AttendanceStatus from './attendance/AttendanceStatus';
import { useAttendance } from './attendance/hooks/useAttendance';

const AttendanceCapture: React.FC = () => {
  const {
    capturing,
    image,
    uploading,
    checkedIn,
    checkInTime,
    checkOutTime,
    uploadError,
    videoRef,
    handlePhotoCapture,
    handleCancelCapture,
    startCamera,
    resetCapture,
    handleQuickCheckIn,
    handleCheckIn,
    handleCheckOut
  } = useAttendance();

  return (
    <div className="cyber-panel p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6 relative">
        <span className="neon-text-blue">Attendance</span> Capture
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyber-neon-blue to-transparent mt-2"></div>
      </h2>

      <div className="flex flex-col items-center space-y-4">
        <CameraDisplay 
          capturing={capturing} 
          image={image} 
          videoRef={videoRef} 
        />

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {!checkedIn && !capturing && !image && (
            <Button 
              onClick={handleQuickCheckIn}
              className="bg-green-600 hover:bg-green-700"
              disabled={uploading}
            >
              <Check className="mr-2 h-4 w-4" /> Quick Check In
            </Button>
          )}

          {!capturing && !image && (
            <button
              onClick={startCamera}
              className="cyber-button-sm"
              disabled={uploading}
            >
              <Camera size={16} className="mr-1" /> {checkedIn ? "Capture for Check Out" : "Capture with Photo"}
            </button>
          )}

          {capturing && (
            <CameraCapture 
              onPhotoCapture={handlePhotoCapture} 
              onCancel={handleCancelCapture}
              videoRef={videoRef}
            />
          )}

          {image && (
            <AttendanceActions 
              image={image}
              checkedIn={checkedIn}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              onRetake={resetCapture}
            />
          )}
        </div>

        {uploading && (
          <p className="text-sm text-cyber-neon-blue animate-pulse mt-2">
            Uploading photo...
          </p>
        )}

        {uploadError && (
          <p className="text-sm text-cyber-neon-pink mt-2">
            {uploadError}
          </p>
        )}

        <AttendanceStatus 
          checkedIn={checkedIn} 
          checkInTime={checkInTime}
          checkOutTime={checkOutTime}
        />
      </div>
    </div>
  );
};

export default AttendanceCapture;
