
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Calendar, File, Plus, Edit, Trash } from 'lucide-react';
import { toast } from "sonner";

const AdminLeaveTypeSettings: React.FC = () => {
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLeaveType, setNewLeaveType] = useState({ name: '', description: '' });
  const [editingLeaveType, setEditingLeaveType] = useState<any>(null);
  const { toast: uiToast } = useToast();

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
      fetchLeaveTypes();
    } catch (error: any) {
      console.error('Error creating leave type:', error);
      toast.error(error.message || "Failed to create leave type");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLeaveType = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingLeaveType.name.trim()) {
      toast.error("Leave type name is required");
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('leave_types')
        .update({ 
          name: editingLeaveType.name.trim(),
          description: editingLeaveType.description.trim() || null
        })
        .eq('id', editingLeaveType.id)
        .select();

      if (error) {
        throw error;
      }

      toast.success("Leave type updated successfully");
      
      setEditingLeaveType(null);
      fetchLeaveTypes();
    } catch (error: any) {
      console.error('Error updating leave type:', error);
      toast.error(error.message || "Failed to update leave type");
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

        {/* Edit Leave Type Form */}
        {editingLeaveType && (
          <div className="mb-8 border-t border-cyber-neon-purple/20 pt-6 mt-6">
            <h3 className="text-lg font-medium mb-3">Edit Leave Type</h3>
            <form onSubmit={handleUpdateLeaveType} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={editingLeaveType.name}
                    onChange={(e) => setEditingLeaveType({...editingLeaveType, name: e.target.value})}
                    className="w-full p-2 bg-cyber-gray-900 border border-cyber-neon-purple/30 rounded"
                    placeholder="Annual Leave"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                  <input
                    type="text"
                    value={editingLeaveType.description || ''}
                    onChange={(e) => setEditingLeaveType({...editingLeaveType, description: e.target.value})}
                    className="w-full p-2 bg-cyber-gray-900 border border-cyber-neon-purple/30 rounded"
                    placeholder="Regular yearly leave entitlement"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setEditingLeaveType(null)}
                  className="cyber-button-sm bg-cyber-gray-800"
                  disabled={isLoading}
                >
                  Cancel
                </button>
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
                      <Edit size={16} className="mr-1" />
                      Update Leave Type
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Leave Types List */}
        <div>
          <h3 className="text-lg font-medium mb-3">Existing Leave Types</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-neon-purple/20">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveTypes.length > 0 ? (
                  leaveTypes.map((leaveType) => (
                    <tr key={leaveType.id} className="border-b border-cyber-neon-purple/10 hover:bg-cyber-gray-900/30">
                      <td className="px-4 py-3 font-medium">{leaveType.name}</td>
                      <td className="px-4 py-3 text-gray-400">{leaveType.description || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingLeaveType(leaveType)}
                            className="p-1 rounded-full hover:bg-cyber-neon-blue/20 text-cyber-neon-blue"
                            title="Edit Leave Type"
                            disabled={isLoading}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteLeaveType(leaveType.id)}
                            className="p-1 rounded-full hover:bg-red-500/20 text-red-400"
                            title="Delete Leave Type"
                            disabled={isLoading}
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                      <File size={32} className="mx-auto mb-2" />
                      No leave types found. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaveTypeSettings;
