
import React, { useState } from 'react';
import { FileText, Send, Calendar, Check } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LeaveType } from './types/leave-types';

interface LeaveFormData {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface LeaveFormProps {
  leaveTypes: LeaveType[];
  employeeId: string | null;
  onSubmitSuccess: () => void;
  isSubmitted: boolean;
}

const LeaveRequestForm: React.FC<LeaveFormProps> = ({ 
  leaveTypes, 
  employeeId,
  onSubmitSuccess,
  isSubmitted
}) => {
  const [formData, setFormData] = useState<LeaveFormData>({
    type: leaveTypes.length > 0 ? leaveTypes[0].id : '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) {
      toast({
        title: "Error",
        description: "User information not found. Please log in again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Find the leave type ID based on selection
      const selectedLeaveTypeId = formData.type;
      
      // Insert the leave request
      const { data, error } = await supabase
        .from('leaves')
        .insert({
          employee_id: employeeId,
          leave_type_id: selectedLeaveTypeId,
          start_date: formData.startDate,
          end_date: formData.endDate,
          reason: formData.reason,
          status: 'pending'
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      // Show success message
      toast({
        title: "Success",
        description: "Your leave request has been submitted successfully!",
      });
      
      onSubmitSuccess();
      
      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          type: leaveTypes.length > 0 ? leaveTypes[0].id : '',
          startDate: '',
          endDate: '',
          reason: '',
        });
      }, 3000);
      
    } catch (error: any) {
      console.error('Error submitting leave request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit leave request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="bg-cyber-neon-blue/10 border border-cyber-neon-blue p-4 rounded flex items-center mb-6">
        <Check size={20} className="text-cyber-neon-blue mr-2" />
        <p>Your leave request has been submitted successfully!</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Leave Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 bg-cyber-gray-900 border border-cyber-neon-purple/30 rounded focus:border-cyber-neon-purple focus:ring-1 focus:ring-cyber-neon-purple outline-none"
          required
        >
          {leaveTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <div className="relative">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 bg-cyber-gray-900 border border-cyber-neon-purple/30 rounded focus:border-cyber-neon-purple focus:ring-1 focus:ring-cyber-neon-purple outline-none"
              required
            />
            <Calendar size={18} className="absolute right-3 top-[10px] text-cyber-neon-purple/50 pointer-events-none" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <div className="relative">
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 bg-cyber-gray-900 border border-cyber-neon-purple/30 rounded focus:border-cyber-neon-purple focus:ring-1 focus:ring-cyber-neon-purple outline-none"
              required
            />
            <Calendar size={18} className="absolute right-3 top-[10px] text-cyber-neon-purple/50 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Reason</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 bg-cyber-gray-900 border border-cyber-neon-purple/30 rounded focus:border-cyber-neon-purple focus:ring-1 focus:ring-cyber-neon-purple outline-none"
          required
        ></textarea>
      </div>
      
      <div>
        <button
          type="submit"
          className={`cyber-button flex items-center justify-center w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-cyber-neon-purple border-t-transparent rounded-full"></div>
              Processing...
            </>
          ) : (
            <>
              <Send size={18} className="mr-2" />
              Submit Request
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default LeaveRequestForm;
