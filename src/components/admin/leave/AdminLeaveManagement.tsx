
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import AdminLeaveOverview from './AdminLeaveOverview';
import AdminLeaveRequestsList from './AdminLeaveRequestsList';
import AdminLeaveTypeSettings from './AdminLeaveTypeSettings';

const AdminLeaveManagement: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'settings'>('pending');

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leaves')
        .select(`
          id, 
          start_date, 
          end_date, 
          status, 
          reason,
          leave_types(id, name),
          employees(id, name, email, department)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setLeaveRequests(data);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLeaveStatus = async (leaveId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('leaves')
        .update({ status })
        .eq('id', leaveId);

      if (error) {
        throw error;
      }

      // Refresh the data after update
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 ${
            activeTab === 'pending'
              ? 'bg-cyber-neon-pink/10 text-cyber-neon-pink border-b-2 border-cyber-neon-pink'
              : 'text-gray-400 hover:text-cyber-neon-blue'
          }`}
        >
          Pending Requests
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 ${
            activeTab === 'all'
              ? 'bg-cyber-neon-blue/10 text-cyber-neon-blue border-b-2 border-cyber-neon-blue'
              : 'text-gray-400 hover:text-cyber-neon-blue'
          }`}
        >
          All Requests
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 ${
            activeTab === 'settings'
              ? 'bg-cyber-neon-purple/10 text-cyber-neon-purple border-b-2 border-cyber-neon-purple'
              : 'text-gray-400 hover:text-cyber-neon-blue'
          }`}
        >
          Leave Settings
        </button>
      </div>

      {activeTab === 'pending' && (
        <AdminLeaveRequestsList
          leaveRequests={leaveRequests.filter(request => request.status === 'pending')}
          onUpdateStatus={handleUpdateLeaveStatus}
          isLoading={isLoading}
          isPendingOnly={true}
        />
      )}

      {activeTab === 'all' && (
        <>
          <AdminLeaveOverview leaveRequests={leaveRequests} />
          <AdminLeaveRequestsList
            leaveRequests={leaveRequests}
            onUpdateStatus={handleUpdateLeaveStatus}
            isLoading={isLoading}
            isPendingOnly={false}
          />
        </>
      )}

      {activeTab === 'settings' && (
        <AdminLeaveTypeSettings />
      )}
    </div>
  );
};

export default AdminLeaveManagement;
