
import React from 'react';
import { Check, Camera, AlertTriangle } from 'lucide-react';
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

      {uploadError && (
        <div className="bg-cyber-neon-pink/10 border border-cyber-neon-pink rounded-md p-4 flex items-start">
          <AlertTriangle className="text-cyber-neon-pink h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-cyber-neon-pink font-medium">Error</h4>
            <p className="text-sm text-cyber-neon-pink/80 mt-1">{uploadError}</p>
          </div>
        </div>
      )}

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
          <div className="flex items-center justify-center space-x-2 text-sm text-cyber-neon-blue animate-pulse mt-2">
            <div className="h-4 w-4 border-t-2 border-cyber-neon-blue rounded-full animate-spin"></div>
            <p>Uploading photo and processing attendance...</p>
          </div>
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
