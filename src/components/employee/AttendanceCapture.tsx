
import React, { useState, useRef } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Camera } from 'lucide-react';
import CameraCapture from './attendance/CameraCapture';
import CameraDisplay from './attendance/CameraDisplay';
import AttendanceActions from './attendance/AttendanceActions';
import AttendanceStatus from './attendance/AttendanceStatus';

const AttendanceCapture = () => {
  const [capturing, setCapturing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | undefined>(undefined);
  const [checkOutTime, setCheckOutTime] = useState<string | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePhotoCapture = (imageData: string) => {
    console.log("Photo received in AttendanceCapture");
    setImage(imageData);
    setCapturing(false);
  };

  const handleCancelCapture = () => {
    setCapturing(false);
  };

  const startCamera = async () => {
    try {
      setCapturing(true);
    } catch (error) {
      console.error('Error starting camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  const resetCapture = () => {
    setImage(null);
    startCamera();
  };

  const handleQuickCheckIn = () => {
    // Quick check-in without photo
    const now = new Date();
    setCheckInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setCheckedIn(true);
    
    // Show success message
    toast.success('Successfully checked in!');
  };

  const handleCheckIn = () => {
    // In a real app, we would handle the image upload to Supabase Storage here
    console.log('Checking in with image:', image);
    const now = new Date();
    setCheckInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setCheckedIn(true);
    setImage(null);

    // Show success message
    toast.success('Successfully checked in!');
  };

  const handleCheckOut = () => {
    // In a real app, we would handle the image upload to Supabase Storage here
    console.log('Checking out with image:', image);
    const now = new Date();
    setCheckOutTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setCheckedIn(false);
    setImage(null);

    // Show success message
    toast.success('Successfully checked out!');
  };

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
            >
              <Check className="mr-2 h-4 w-4" /> Quick Check In
            </Button>
          )}

          {!capturing && !image && (
            <button
              onClick={startCamera}
              className="cyber-button-sm"
            >
              <Camera size={16} className="mr-1" /> {checkedIn ? "Capture for Check Out" : "Capture with Photo"}
            </button>
          )}

          {capturing && (
            <CameraCapture 
              onPhotoCapture={handlePhotoCapture} 
              onCancel={handleCancelCapture}
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
