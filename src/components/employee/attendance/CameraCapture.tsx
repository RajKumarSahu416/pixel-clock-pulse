
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { toast } from "sonner";

interface CameraCaptureProps {
  onPhotoCapture: (imageData: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoCapture, onCancel }) => {
  const [capturing, setCapturing] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
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
    setIsStarting(true);
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
        
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log("Camera successfully started");
                setCapturing(true);
                setIsStarting(false);
              })
              .catch(error => {
                console.error("Failed to play video:", error);
                toast.error("Failed to start video playback");
                setIsStarting(false);
              });
          }
        };
      } else {
        console.error("Video ref is null");
        toast.error("Camera initialization failed");
        setIsStarting(false);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
      setIsStarting(false);
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
        toast.error('Failed to capture photo. Please try again.');
      }
    } else {
      console.error('Video element or stream not available');
      toast.error('Camera not ready. Please restart camera.');
    }
  };

  if (!capturing) {
    return (
      <button 
        onClick={startCamera} 
        className="cyber-button cyber-button-blue flex items-center justify-center gap-2"
        disabled={isStarting}
      >
        <Camera size={18} />
        {isStarting ? "Starting Camera..." : "Start Camera"}
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
