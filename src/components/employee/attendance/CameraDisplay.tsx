
import React, { useEffect, useState } from 'react';
import { Camera, VideoOff } from 'lucide-react';

interface CameraDisplayProps {
  capturing: boolean;
  image: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const CameraDisplay: React.FC<CameraDisplayProps> = ({ capturing, image, videoRef }) => {
  const [videoError, setVideoError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset video error state when capturing changes
  useEffect(() => {
    if (capturing) {
      setVideoError(false);
      setLoading(true);
      
      // Add event listener to detect when video is playing
      const handlePlaying = () => {
        console.log("Video is now playing");
        setLoading(false);
      };
      
      if (videoRef.current) {
        videoRef.current.addEventListener('playing', handlePlaying);
        
        // Add a timeout to detect if video doesn't start
        const timeoutId = setTimeout(() => {
          if (loading) {
            console.log("Video loading timed out");
            setLoading(false);
          }
        }, 10000); // 10 second timeout
        
        return () => {
          if (videoRef.current) {
            videoRef.current.removeEventListener('playing', handlePlaying);
          }
          clearTimeout(timeoutId);
        };
      }
    } else {
      setLoading(false);
    }
  }, [capturing, videoRef]);

  // Handle video errors
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video element encountered an error", e);
    setVideoError(true);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md cyber-border rounded-lg overflow-hidden bg-black/40 aspect-video flex items-center justify-center relative">
      {capturing && !videoError ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            onError={handleVideoError}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-pulse text-cyber-neon-blue">
                <p className="text-center">Starting camera...</p>
              </div>
            </div>
          )}
        </>
      ) : image ? (
        <img src={image} alt="Captured" className="w-full h-full object-cover" />
      ) : videoError ? (
        <div className="text-center p-8">
          <VideoOff size={64} className="mx-auto mb-4 text-cyber-neon-pink" />
          <p className="text-red-400">Camera error. Please check permissions and try again.</p>
        </div>
      ) : (
        <div className="text-center p-8">
          <Camera size={64} className="mx-auto mb-4 text-cyber-neon-blue" />
          <p className="text-gray-300">Click "Start Camera" to begin</p>
        </div>
      )}
      
      {/* Scanline effect */}
      <div className="scan-line"></div>
      
      {/* Camera grid overlay */}
      {capturing && !videoError && !loading && (
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
