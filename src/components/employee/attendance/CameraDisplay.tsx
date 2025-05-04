
import React from 'react';
import { Camera } from 'lucide-react';

interface CameraDisplayProps {
  capturing: boolean;
  image: string | null;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

const CameraDisplay: React.FC<CameraDisplayProps> = ({ capturing, image, videoRef }) => {
  return (
    <div className="w-full max-w-md cyber-border rounded-lg overflow-hidden bg-black/40 aspect-video flex items-center justify-center relative">
      {capturing ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
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
  );
};

export default CameraDisplay;
