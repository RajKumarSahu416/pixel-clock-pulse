
import React, { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';

interface CameraCaptureProps {
  onPhotoCapture: (imageData: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoCapture, onCancel }) => {
  const [capturing, setCapturing] = useState(false);
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
        onPhotoCapture(imageData);
        stopCamera();
      }
    }
  };

  if (!capturing) {
    return (
      <button 
        onClick={startCamera} 
        className="cyber-button cyber-button-blue"
      >
        Start Camera
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={capturePhoto}
        className="cyber-button"
      >
        Capture Photo
      </button>
      <button 
        onClick={() => {
          stopCamera();
          onCancel();
        }}
        className="cyber-button cyber-button-pink"
      >
        Cancel
      </button>
    </>
  );
};

export default CameraCapture;
