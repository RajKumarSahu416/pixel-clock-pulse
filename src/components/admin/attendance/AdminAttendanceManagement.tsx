
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import AdminAttendanceList from './AdminAttendanceList';
import { format } from 'date-fns';
import { toast } from "sonner";

const AdminAttendanceManagement: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchAttendanceRecords();
  }, [dateFilter]);

  const fetchAttendanceRecords = async () => {
    setIsLoading(true);
    try {
      console.log(`Fetching attendance records for date: ${dateFilter}`);
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          id, 
          employee_id,
          date,
          check_in_time, 
          check_out_time, 
          check_in_photo,
          check_out_photo,
          status,
          employees(id, name, department)
        `)
        .eq('date', dateFilter)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching attendance records:', error);
        toast.error('Failed to load attendance records');
        throw error;
      }

      console.log(`Retrieved ${data?.length || 0} attendance records`);
      if (data) {
        setAttendanceRecords(data);
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance Management</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="dateFilter" className="text-sm text-gray-400">Date:</label>
          <input
            id="dateFilter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-cyber-gray-900/50 border border-cyber-neon-blue/30 rounded px-3 py-1 text-sm"
          />
        </div>
      </div>

      <div className="cyber-panel p-6">
        <AdminAttendanceList
          attendanceRecords={attendanceRecords}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AdminAttendanceManagement;
