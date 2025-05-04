
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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if the user has already checked in today
    const fetchAttendanceStatus = async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching attendance status:', error);
        toast.error('Unable to check attendance status. Please try again later.');
      }
    };
    
    fetchAttendanceStatus();
  }, []);

  const handlePhotoCapture = (imageData: string) => {
    console.log("Photo received in AttendanceCapture");
    setImage(imageData);
    setCapturing(false);
    // Clear any previous errors when capturing a new photo
    setUploadError(null);
  };

  const handleCancelCapture = () => {
    setCapturing(false);
  };

  const startCamera = () => {
    try {
      setCapturing(true);
      // Clear any previous errors when starting camera
      setUploadError(null);
    } catch (error) {
      console.error('Error starting camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  const resetCapture = () => {
    setImage(null);
    setUploadError(null);
    startCamera();
  };

  const handleQuickCheckIn = async () => {
    try {
      setUploading(true);
      const result = await performQuickCheckIn();
      setUploading(false);
      
      if (result.success) {
        setCheckInTime(result.time);
        setCheckedIn(true);
        toast.success('Successfully checked in!');
      } else {
        throw result.error;
      }
    } catch (error) {
      setUploading(false);
      console.error('Error during quick check-in:', error);
      toast.error('Failed to check in. Please try again.');
    }
  };

  const handleCheckIn = async () => {
    setUploadError(null);
    try {
      setUploading(true);
      
      // Upload image to storage if available
      console.log('Uploading photo for check-in...');
      let photoUrl = null;
      
      if (image) {
        photoUrl = await uploadImage(image);
        if (!photoUrl) {
          setUploadError('Failed to upload photo. Please check permissions and try again.');
          console.error('Failed to upload image');
          toast.error('Failed to upload photo. Please try again.');
          setUploading(false);
          return;
        }
      }
      
      // Only proceed with check-in if photo upload was successful (or no photo)
      console.log("Photo uploaded successfully, proceeding with check-in");
      const result = await performCheckIn(photoUrl);
      
      if (result.success) {
        setCheckInTime(result.time);
        setCheckedIn(true);
        setImage(null);
        toast.success('Successfully checked in with photo!');
      } else {
        throw new Error(result.error || 'Unknown error during check-in');
      }
    } catch (error: any) {
      console.error('Error during check-in:', error);
      setUploadError(error.message || 'Failed to check in. Please try again.');
      toast.error('Failed to check in. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCheckOut = async () => {
    setUploadError(null);
    try {
      setUploading(true);
      
      // Upload image to storage if available
      console.log('Uploading photo for check-out...');
      let photoUrl = null;
      
      if (image) {
        photoUrl = await uploadImage(image);
        if (!photoUrl) {
          setUploadError('Failed to upload photo. Please check permissions and try again.');
          toast.error('Failed to upload photo. Please try again.');
          setUploading(false);
          return;
        }
      }
      
      // Only proceed with check-out if photo upload was successful (or no photo)
      console.log("Photo uploaded successfully, proceeding with check-out");
      const result = await performCheckOut(photoUrl);
      
      if (result.success) {
        setCheckOutTime(result.time);
        setCheckedIn(false);
        setImage(null);
        toast.success('Successfully checked out!');
      } else {
        throw new Error(result.error || 'Unknown error during check-out');
      }
    } catch (error: any) {
      console.error('Error during check-out:', error);
      setUploadError(error.message || 'Failed to check out. Please try again.');
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
    uploadError,
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
