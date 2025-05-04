
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Plus } from 'lucide-react';
import { toast } from "sonner";
import { LeaveTypeFormData } from '../types';

interface CreateLeaveTypeFormProps {
  onSuccess: () => void;
}

const CreateLeaveTypeForm: React.FC<CreateLeaveTypeFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newLeaveType, setNewLeaveType] = useState<LeaveTypeFormData>({ name: '', description: '' });

  const handleCreateLeaveType = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLeaveType.name.trim()) {
      toast.error("Leave type name is required");
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('leave_types')
        .insert([
          { 
            name: newLeaveType.name.trim(),
            description: newLeaveType.description.trim() || null
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      toast.success("Leave type created successfully");
      
      setNewLeaveType({ name: '', description: '' });
      onSuccess();
    } catch (error: any) {
      console.error('Error creating leave type:', error);
      toast.error(error.message || "Failed to create leave type");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-3">Add New Leave Type</h3>
      <form onSubmit={handleCreateLeaveType} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={newLeaveType.name}
              onChange={(e) => setNewLeaveType({...newLeaveType, name: e.target.value})}
              className="w-full p-2 bg-cyber-gray-900 border border-cyber-neon-purple/30 rounded"
              placeholder="Annual Leave"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
            <input
              type="text"
              value={newLeaveType.description}
              onChange={(e) => setNewLeaveType({...newLeaveType, description: e.target.value})}
              className="w-full p-2 bg-cyber-gray-900 border border-cyber-neon-purple/30 rounded"
              placeholder="Regular yearly leave entitlement"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button 
            type="submit"
            className="cyber-button-sm flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <Plus size={16} className="mr-1" />
                Add Leave Type
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLeaveTypeForm;
