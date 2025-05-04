
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
    
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const fileName = `attendance/${timestamp}.png`;
    
    console.log("Uploading to bucket 'photos' with fileName:", fileName);
    
    // Try to ensure bucket exists (this is a public bucket)
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('photos');
    if (bucketError) {
      console.log("Bucket may not exist, attempting to create");
      const { error: createError } = await supabase.storage.createBucket('photos', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        console.error("Error creating bucket:", createError);
      }
    }
    
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
        toast.error('Permission denied. Storage policies need to be updated.');
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
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error checking attendance status:', error);
    return null;
  }
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
      console.error('Error checking existing attendance:', fetchError);
      throw fetchError;
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
        
      if (error) throw error;
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
        console.error('Insert error:', error);
        throw error;
      }
      console.log('New attendance record created:', data);
    }

    return {
      success: true,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    console.error('Error during quick check-in:', error);
    return { success: false, error };
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
      console.error('Error checking existing attendance:', fetchError);
      throw fetchError;
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
        console.error('Update error:', error);
        throw error;
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
        console.error('Insert error:', error);
        throw error;
      }
      
      console.log('New attendance record created with photo:', data);
    }
    
    return {
      success: true,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    console.error('Error during check-in:', error);
    return { success: false, error };
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
      console.error('Error fetching attendance record:', fetchError);
      throw fetchError;
    }
    
    if (!attendanceData) {
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
      console.error('Update error for check-out:', error);
      throw error;
    }
    
    return {
      success: true,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    console.error('Error during check-out:', error);
    return { success: false, error };
  }
}
