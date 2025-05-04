
import React, { useState, useRef } from 'react';
import { Camera, X, Check } from 'lucide-react';

const AttendanceCapture = () => {
  const [capturing, setCapturing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setImage(imageData);
        stopCamera();
      }
    }
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

  const resetCapture = () => {
    setImage(null);
    startCamera();
  };

  return (
    <div className="cyber-panel p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6 relative">
        <span className="neon-text-blue">Attendance</span> Capture
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyber-neon-blue to-transparent mt-2"></div>
      </h2>

      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-md cyber-border rounded-lg overflow-hidden bg-black/40 aspect-video flex items-center justify-center relative">
          {capturing ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : image ? (
            <img src={image} alt="Captured" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              <Camera size={64} className="mx-auto mb-4 text-cyber-neon-blue" />
              <p className="text-gray-300">Click "Start Camera" to begin</p>
            </div>
          )}
          
          {/* Scanline effect */}
          <div className="scan-line"></div>
          
          {/* Camera grid overlay */}
          {capturing && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full border border-cyber-neon-blue/20 grid grid-cols-3 grid-rows-3">
                {Array(9).fill(0).map((_, i) => (
                  <div key={i} className="border border-cyber-neon-blue/10"></div>
                ))}
              </div>
              <div className="absolute top-2 left-2 bg-cyber-neon-blue/10 px-2 py-1 text-xs text-cyber-neon-blue animate-pulse border border-cyber-neon-blue/30">
                REC
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-4">
          {!capturing && !image && (
            <button 
              onClick={startCamera} 
              className="cyber-button cyber-button-blue"
            >
              Start Camera
            </button>
          )}

          {capturing && (
            <>
              <button 
                onClick={capturePhoto}
                className="cyber-button"
              >
                Capture Photo
              </button>
              <button 
                onClick={stopCamera}
                className="cyber-button cyber-button-pink"
              >
                Cancel
              </button>
            </>
          )}

          {image && (
            <>
              <button 
                onClick={!checkedIn ? handleCheckIn : handleCheckOut}
                className="cyber-button"
              >
                <Check size={18} className="inline mr-1" />
                {!checkedIn ? "Check In" : "Check Out"}
              </button>
              <button 
                onClick={resetCapture}
                className="cyber-button cyber-button-pink"
              >
                <X size={18} className="inline mr-1" />
                Retake
              </button>
            </>
          )}
        </div>

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
      </div>
    </div>
  );
};

export default AttendanceCapture;
