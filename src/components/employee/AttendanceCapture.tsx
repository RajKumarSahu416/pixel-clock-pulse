
import React, { useState, useRef } from 'react';
import CameraCapture from './attendance/CameraCapture';
import CameraDisplay from './attendance/CameraDisplay';
import AttendanceActions from './attendance/AttendanceActions';
import AttendanceStatus from './attendance/AttendanceStatus';

const AttendanceCapture = () => {
  const [capturing, setCapturing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handlePhotoCapture = (imageData: string) => {
    setImage(imageData);
    setCapturing(false);
  };

  const handleCancelCapture = () => {
    setCapturing(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setCapturing(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const resetCapture = () => {
    setImage(null);
    startCamera();
  };

  const handleCheckIn = () => {
    // In a real app, we would handle the image upload to Supabase Storage here
    console.log('Checking in with image:', image);
    setCheckedIn(true);
    setImage(null);

    // Mock API call
    setTimeout(() => {
      console.log('Check-in successful!');
    }, 1000);
  };

  const handleCheckOut = () => {
    // In a real app, we would handle the image upload to Supabase Storage here
    console.log('Checking out with image:', image);
    setCheckedIn(false);
    setImage(null);

    // Mock API call
    setTimeout(() => {
      console.log('Check-out successful!');
    }, 1000);
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

        <div className="flex space-x-3 mt-4">
          {!capturing && !image && (
            <CameraCapture 
              onPhotoCapture={handlePhotoCapture} 
              onCancel={handleCancelCapture}
            />
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

        <AttendanceStatus checkedIn={checkedIn} />
      </div>
    </div>
  );
};

export default AttendanceCapture;
