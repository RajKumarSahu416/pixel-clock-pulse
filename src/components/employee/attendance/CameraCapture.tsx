
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { toast } from "sonner";

interface CameraCaptureProps {
  onPhotoCapture: (imageData: string) => void;
  onCancel: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoCapture, onCancel, videoRef }) => {
  const [capturing, setCapturing] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera when component mounts
  useEffect(() => {
    startCamera();
    
    // Clean up camera stream when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setIsStarting(true);
    try {
      console.log("Attempting to start camera...");
      const constraints = { 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 } 
        } 
      };
      
      console.log("Camera constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        console.log("Setting video source to stream");
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            console.log("Video metadata loaded, attempting to play");
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
    console.log("Stopping camera stream");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      streamRef.current = null;
    }
    setCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && streamRef.current) {
      try {
        console.log("Capturing photo from video stream");
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
        } else {
          console.error("Failed to get canvas context");
          toast.error("Failed to capture photo");
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-center">
        <button 
          onClick={capturePhoto}
          className="cyber-button flex items-center justify-center gap-2"
          disabled={!capturing || isStarting}
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
      
      {isStarting && (
        <p className="text-xs text-center text-cyber-neon-blue animate-pulse">
          Starting camera...
        </p>
      )}

      {capturing && (
        <p className="text-xs text-center text-cyber-neon-blue">
          Look at the camera and click "Capture Photo"
        </p>
      )}
    </div>
  );
};

export default CameraCapture;
