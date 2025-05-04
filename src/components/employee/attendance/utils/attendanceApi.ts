
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Generate a fixed test UUID - in a real app, use auth.user().id
export const TEST_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export async function uploadImage(imageData: string): Promise<string | null> {
  if (!imageData) return null;
  
  try {
    console.log("Starting image upload process...");
    
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
    
    // Generate a unique filename with a timestamp and random string to prevent collisions
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileName = `attendance/${timestamp}_${randomString}.png`;
    
    console.log("Uploading to bucket 'photos' with fileName:", fileName);
    
    // Skip bucket checks since we've already created it via SQL

    // Upload to Supabase Storage with retries
    let retries = 3;
    let uploadError = null;
    let data = null;
    
    while (retries > 0) {
      const result = await supabase.storage
        .from('photos')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true // Use upsert to handle any conflicts
        });
        
      if (!result.error) {
        data = result.data;
        break;
      } else {
        uploadError = result.error;
        console.error(`Upload attempt failed (${retries} retries left):`, uploadError);
        retries--;
        
        // Wait before retrying
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    if (uploadError) {
      console.error('All upload attempts failed:', uploadError);
      
      // Special error handling for RLS policy issues
      if (uploadError.message && uploadError.message.includes('row-level security policy')) {
        throw new Error('Storage permission denied. Please log in or contact your administrator.');
      }
      
      throw uploadError;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(fileName);
    
    console.log("File uploaded successfully, URL:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // More detailed error handling
    if (error instanceof Error) {
      if (error.message && error.message.includes('row-level security')) {
        toast.error('Permission denied. Please log in or contact your administrator.');
      } else if (error.message && error.message.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(`Upload failed: ${error.message}`);
      }
    } else {
      toast.error('Failed to upload image. Please try again.');
    }
    
    return null;
  }
}

export async function checkAttendanceStatus() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const userId = TEST_USER_ID;
    
    const { data, error } = await supabase
      .from('attendance')
      .select('check_in_time, check_out_time')
      .eq('employee_id', userId)
      .eq('date', today)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching attendance status:', error);
      toast.error('Failed to check attendance status.');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error checking attendance status:', error);
    toast.error('Error checking attendance status.');
    return null;
  }
}

// Helper function to handle common attendance operation errors
function handleAttendanceError(error: any, operation: string): { success: false, error: any } {
  console.error(`Error during ${operation}:`, error);
  
  // Check for common RLS policy issues
  if (error && error.code === '42501' && error.message && error.message.includes('row-level security policy')) {
    toast.error(`Permission denied. Please log in and try again.`);
    return { success: false, error: new Error('Permission denied') };
  }
  
  // Handle other database errors
  if (error && error.code) {
    toast.error(`Database error (${error.code}). Please try again later.`);
  } else {
    toast.error(`Failed to ${operation}. Please try again.`);
  }
  
  return { success: false, error };
}

export async function performQuickCheckIn() {
  try {
    const now = new Date();
    const todayDate = now.toISOString().split('T')[0];
    const userId = TEST_USER_ID;

    console.log(`Attempting quick check-in for user ${userId} on date ${todayDate}`);

    // Check if entry exists for today
    const { data: existingData, error: fetchError } = await supabase
      .from('attendance')
      .select('id')
      .eq('employee_id', userId)
      .eq('date', todayDate)
      .maybeSingle();
    
    if (fetchError) {
      return handleAttendanceError(fetchError, 'checking existing attendance');
    }

    if (existingData) {
      console.log(`Existing attendance record found with ID: ${existingData.id}, updating...`);
      // Update existing record
      const { error } = await supabase
        .from('attendance')
        .update({
          check_in_time: now.toISOString(),
          status: 'present'
        })
        .eq('id', existingData.id);
        
      if (error) {
        return handleAttendanceError(error, 'updating check-in');
      }
    } else {
      console.log('No existing attendance record, creating new record...');
      // Create new record
      const { data, error } = await supabase
        .from('attendance')
        .insert([{
          employee_id: userId,
          date: todayDate,
          check_in_time: now.toISOString(),
          status: 'present'
        }])
        .select();
        
      if (error) {
        return handleAttendanceError(error, 'creating attendance record');
      }
      console.log('New attendance record created:', data);
    }

    toast.success('Successfully checked in!');
    return {
      success: true,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    return handleAttendanceError(error, 'quick check-in');
  }
}

export async function performCheckIn(photoUrl: string | null) {
  try {
    const now = new Date();
    const todayDate = now.toISOString().split('T')[0];
    const userId = TEST_USER_ID;
    
    // Check if entry exists for today
    const { data: existingData, error: fetchError } = await supabase
      .from('attendance')
      .select('id')
      .eq('employee_id', userId)
      .eq('date', todayDate)
      .maybeSingle();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      return handleAttendanceError(fetchError, 'checking existing attendance');
    }
    
    if (existingData) {
      console.log(`Updating existing attendance record with ID: ${existingData.id}`);
      // Update existing record
      const { error } = await supabase
        .from('attendance')
        .update({
          check_in_time: now.toISOString(),
          check_in_photo: photoUrl,
          status: 'present'
        })
        .eq('id', existingData.id);
        
      if (error) {
        return handleAttendanceError(error, 'updating check-in record');
      }
    } else {
      console.log('Creating new attendance record with photo');
      // Create new record
      const { data, error } = await supabase
        .from('attendance')
        .insert([{
          employee_id: userId,
          date: todayDate,
          check_in_time: now.toISOString(),
          check_in_photo: photoUrl,
          status: 'present'
        }])
        .select();
        
      if (error) {
        return handleAttendanceError(error, 'creating attendance record');
      }
      
      console.log('New attendance record created with photo:', data);
    }
    
    toast.success('Successfully checked in with photo!');
    return {
      success: true,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    return handleAttendanceError(error, 'check-in with photo');
  }
}

export async function performCheckOut(photoUrl: string | null) {
  try {
    const now = new Date();
    const todayDate = now.toISOString().split('T')[0];
    const userId = TEST_USER_ID;
    
    // Get today's attendance record
    const { data: attendanceData, error: fetchError } = await supabase
      .from('attendance')
      .select('id')
      .eq('employee_id', userId)
      .eq('date', todayDate)
      .maybeSingle();
      
    if (fetchError) {
      return handleAttendanceError(fetchError, 'fetching attendance record');
    }
    
    if (!attendanceData) {
      toast.error('No check-in record found for today. Please check in first.');
      throw new Error('No check-in record found for today');
    }
    
    console.log(`Updating attendance record ${attendanceData.id} with check-out data`);
    // Update with check out time
    const { error } = await supabase
      .from('attendance')
      .update({
        check_out_time: now.toISOString(),
        check_out_photo: photoUrl
      })
      .eq('id', attendanceData.id);
      
    if (error) {
      return handleAttendanceError(error, 'updating check-out record');
    }
    
    toast.success('Successfully checked out!');
    return {
      success: true,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    return handleAttendanceError(error, 'check-out');
  }
}
