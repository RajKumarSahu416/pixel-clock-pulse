
import { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import {
  checkAttendanceStatus,
  uploadImage,
  performQuickCheckIn,
  performCheckIn,
  performCheckOut
} from '../utils/attendanceApi';

export function useAttendance() {
  const [capturing, setCapturing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | undefined>(undefined);
  const [checkOutTime, setCheckOutTime] = useState<string | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if the user has already checked in today
    const fetchAttendanceStatus = async () => {
      const data = await checkAttendanceStatus();
      
      if (data) {
        if (data.check_in_time) {
          setCheckedIn(true);
          setCheckInTime(new Date(data.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        
        if (data.check_out_time) {
          setCheckedIn(false);
          setCheckOutTime(new Date(data.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    };
    
    fetchAttendanceStatus();
  }, []);

  const handlePhotoCapture = (imageData: string) => {
    console.log("Photo received in AttendanceCapture");
    setImage(imageData);
    setCapturing(false);
  };

  const handleCancelCapture = () => {
    setCapturing(false);
  };

  const startCamera = () => {
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

  const handleQuickCheckIn = async () => {
    try {
      const result = await performQuickCheckIn();
      
      if (result.success) {
        setCheckInTime(result.time);
        setCheckedIn(true);
        toast.success('Successfully checked in!');
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error('Error during quick check-in:', error);
      toast.error('Failed to check in. Please try again.');
    }
  };

  const handleCheckIn = async () => {
    try {
      setUploading(true);
      
      // Upload image to storage if available
      console.log('Uploading photo for check-in...');
      const photoUrl = image ? await uploadImage(image) : null;
      
      if (!photoUrl && image) {
        console.error('Failed to upload image');
        toast.error('Failed to upload photo. Please try again.');
        setUploading(false);
        return;
      }
      
      const result = await performCheckIn(photoUrl);
      
      if (result.success) {
        setCheckInTime(result.time);
        setCheckedIn(true);
        setImage(null);
        toast.success('Successfully checked in with photo!');
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error('Error during check-in:', error);
      toast.error('Failed to check in. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setUploading(true);
      
      // Upload image to storage if available
      console.log('Uploading photo for check-out...');
      const photoUrl = image ? await uploadImage(image) : null;
      
      if (!photoUrl && image) {
        toast.error('Failed to upload photo. Please try again.');
        setUploading(false);
        return;
      }
      
      const result = await performCheckOut(photoUrl);
      
      if (result.success) {
        setCheckOutTime(result.time);
        setCheckedIn(false);
        setImage(null);
        toast.success('Successfully checked out!');
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error('Error during check-out:', error);
      toast.error('Failed to check out. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return {
    capturing,
    image,
    uploading,
    checkedIn,
    checkInTime,
    checkOutTime,
    videoRef,
    handlePhotoCapture,
    handleCancelCapture,
    startCamera,
    resetCapture,
    handleQuickCheckIn,
    handleCheckIn,
    handleCheckOut
  };
}
