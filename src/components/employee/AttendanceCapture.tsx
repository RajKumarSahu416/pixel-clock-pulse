
import React, { useState, useRef, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Camera } from 'lucide-react';
import CameraCapture from './attendance/CameraCapture';
import CameraDisplay from './attendance/CameraDisplay';
import AttendanceActions from './attendance/AttendanceActions';
import AttendanceStatus from './attendance/AttendanceStatus';
import { supabase } from "@/integrations/supabase/client";

const AttendanceCapture = () => {
  const [capturing, setCapturing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | undefined>(undefined);
  const [checkOutTime, setCheckOutTime] = useState<string | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userId = "current-user-id"; // In a real app, get this from authentication

  useEffect(() => {
    // Check if the user has already checked in today
    const checkAttendanceStatus = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('attendance')
          .select('check_in_time, check_out_time')
          .eq('employee_id', userId)
          .eq('date', today)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching attendance status:', error);
          return;
        }
        
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
        console.error('Error checking attendance status:', error);
      }
    };
    
    checkAttendanceStatus();
  }, []);

  const handlePhotoCapture = (imageData: string) => {
    console.log("Photo received in AttendanceCapture");
    setImage(imageData);
    setCapturing(false);
  };

  const handleCancelCapture = () => {
    setCapturing(false);
  };

  const startCamera = async () => {
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

  const uploadImage = async (imageData: string): Promise<string | null> => {
    if (!imageData) return null;
    
    try {
      setUploading(true);
      
      // Convert base64 to blob
      const base64Data = imageData.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      const blob = new Blob(byteArrays, { type: 'image/png' });
      
      // Generate a unique filename
      const timestamp = new Date().getTime();
      const fileName = `attendance/${userId}_${timestamp}.png`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(fileName, blob);
        
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);
        
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleQuickCheckIn = async () => {
    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const todayDate = now.toISOString().split('T')[0];

      // Check if entry exists for today
      const { data: existingData } = await supabase
        .from('attendance')
        .select('id')
        .eq('employee_id', userId)
        .eq('date', todayDate);

      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error } = await supabase
          .from('attendance')
          .update({
            check_in_time: now.toISOString(),
            status: 'present'
          })
          .eq('id', existingData[0].id);
          
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('attendance')
          .insert([{
            employee_id: userId,
            date: todayDate,
            check_in_time: now.toISOString(),
            status: 'present'
          }]);
          
        if (error) throw error;
      }

      setCheckInTime(timeString);
      setCheckedIn(true);
      
      // Show success message
      toast.success('Successfully checked in!');
    } catch (error) {
      console.error('Error during quick check-in:', error);
      toast.error('Failed to check in. Please try again.');
    }
  };

  const handleCheckIn = async () => {
    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const todayDate = now.toISOString().split('T')[0];
      
      // Upload image to storage if available
      const photoUrl = image ? await uploadImage(image) : null;
      
      // Check if entry exists for today
      const { data: existingData } = await supabase
        .from('attendance')
        .select('id')
        .eq('employee_id', userId)
        .eq('date', todayDate);
        
      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error } = await supabase
          .from('attendance')
          .update({
            check_in_time: now.toISOString(),
            check_in_photo: photoUrl,
            status: 'present'
          })
          .eq('id', existingData[0].id);
          
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('attendance')
          .insert([{
            employee_id: userId,
            date: todayDate,
            check_in_time: now.toISOString(),
            check_in_photo: photoUrl,
            status: 'present'
          }]);
          
        if (error) throw error;
      }
      
      setCheckInTime(timeString);
      setCheckedIn(true);
      setImage(null);
      
      // Show success message
      toast.success('Successfully checked in with photo!');
    } catch (error) {
      console.error('Error during check-in:', error);
      toast.error('Failed to check in. Please try again.');
    }
  };

  const handleCheckOut = async () => {
    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const todayDate = now.toISOString().split('T')[0];
      
      // Upload image to storage if available
      const photoUrl = image ? await uploadImage(image) : null;
      
      // Get today's attendance record
      const { data: attendanceData, error: fetchError } = await supabase
        .from('attendance')
        .select('id')
        .eq('employee_id', userId)
        .eq('date', todayDate)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Update with check out time
      const { error } = await supabase
        .from('attendance')
        .update({
          check_out_time: now.toISOString(),
          check_out_photo: photoUrl
        })
        .eq('id', attendanceData.id);
        
      if (error) throw error;
      
      setCheckOutTime(timeString);
      setCheckedIn(false);
      setImage(null);
      
      // Show success message
      toast.success('Successfully checked out!');
    } catch (error) {
      console.error('Error during check-out:', error);
      toast.error('Failed to check out. Please try again.');
    }
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

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {!checkedIn && !capturing && !image && (
            <Button 
              onClick={handleQuickCheckIn}
              className="bg-green-600 hover:bg-green-700"
              disabled={uploading}
            >
              <Check className="mr-2 h-4 w-4" /> Quick Check In
            </Button>
          )}

          {!capturing && !image && (
            <button
              onClick={startCamera}
              className="cyber-button-sm"
              disabled={uploading}
            >
              <Camera size={16} className="mr-1" /> {checkedIn ? "Capture for Check Out" : "Capture with Photo"}
            </button>
          )}

          {capturing && (
            <CameraCapture 
              onPhotoCapture={handlePhotoCapture} 
              onCancel={handleCancelCapture}
              videoRef={videoRef}
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

        {uploading && (
          <p className="text-sm text-cyber-neon-blue animate-pulse mt-2">
            Uploading photo...
          </p>
        )}

        <AttendanceStatus 
          checkedIn={checkedIn} 
          checkInTime={checkInTime}
          checkOutTime={checkOutTime}
        />
      </div>
    </div>
  );
};

export default AttendanceCapture;
