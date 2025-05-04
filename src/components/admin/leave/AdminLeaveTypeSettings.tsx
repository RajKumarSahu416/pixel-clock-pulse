
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from 'lucide-react';
import { toast } from "sonner";
import { LeaveTypeData } from './types';
import CreateLeaveTypeForm from './components/CreateLeaveTypeForm';
import EditLeaveTypeForm from './components/EditLeaveTypeForm';
import LeaveTypesList from './components/LeaveTypesList';

const AdminLeaveTypeSettings: React.FC = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveTypeData | null>(null);

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leave_types')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      if (data) {
        setLeaveTypes(data);
      }
    } catch (error) {
      console.error('Error fetching leave types:', error);
      toast.error('Failed to load leave types');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLeaveType = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this leave type? This action cannot be undone.")) {
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('leave_types')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success("Leave type deleted successfully");
      
      fetchLeaveTypes();
    } catch (error: any) {
      console.error('Error deleting leave type:', error);
      toast.error(error.message || "Failed to delete leave type. It may be in use by existing leave requests.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && leaveTypes.length === 0) {
    return <div className="text-center py-8">Loading leave types...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="cyber-panel p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Calendar size={20} className="mr-2 text-cyber-neon-purple" />
          Leave Types Management
        </h2>
        
        {/* Create Leave Type Form */}
        <CreateLeaveTypeForm onSuccess={fetchLeaveTypes} />
        
        {/* Edit Leave Type Form */}
        {editingLeaveType && (
          <EditLeaveTypeForm
            leaveType={editingLeaveType}
            onCancel={() => setEditingLeaveType(null)}
            onSuccess={() => {
              fetchLeaveTypes();
              setEditingLeaveType(null);
            }}
          />
        )}
        
        {/* Leave Types List */}
        <LeaveTypesList
          leaveTypes={leaveTypes}
          isLoading={isLoading}
          onEdit={setEditingLeaveType}
          onDelete={handleDeleteLeaveType}
        />
      </div>
    </div>
  );
};

export default AdminLeaveTypeSettings;
