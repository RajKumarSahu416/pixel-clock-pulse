
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';

interface CameraCaptureProps {
  onPhotoCapture: (imageData: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoCapture, onCancel }) => {
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 } 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for the video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
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
    if (videoRef.current && streamRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Draw the video frame to canvas
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          
          // Convert to data URL
          const imageData = canvas.toDataURL('image/png');
          console.log("Photo captured successfully");
          onPhotoCapture(imageData);
          stopCamera();
        }
      } catch (error) {
        console.error('Error capturing photo:', error);
        alert('Failed to capture photo. Please try again.');
      }
    } else {
      console.error('Video element or stream not available');
    }
  };

  if (!capturing) {
    return (
      <button 
        onClick={startCamera} 
        className="cyber-button cyber-button-blue flex items-center justify-center gap-2"
      >
        <Camera size={18} />
        Start Camera
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-center">
        <button 
          onClick={capturePhoto}
          className="cyber-button flex items-center justify-center gap-2"
        >
          <Camera size={18} />
          Capture Photo
        </button>
        <button 
          onClick={() => {
            stopCamera();
            onCancel();
          }}
          className="cyber-button cyber-button-pink flex items-center justify-center gap-2"
        >
          <X size={18} />
          Cancel
        </button>
      </div>
      
      {capturing && (
        <p className="text-xs text-center text-cyber-neon-blue">
          Look at the camera and click "Capture Photo"
        </p>
      )}
    </div>
  );
};

export default CameraCapture;
