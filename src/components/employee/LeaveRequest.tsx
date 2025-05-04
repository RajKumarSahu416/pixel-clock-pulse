
import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Check } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LeaveRequestForm from './LeaveRequestForm';
import LeaveBalanceDisplay from './LeaveBalanceDisplay';
import RecentLeaveRequests from './RecentLeaveRequests';
import { LeaveType, LeaveBalance, LeaveRequest as LeaveRequestType } from './types/leave-types';

const LeaveRequest = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([]);
  const [recentRequests, setRecentRequests] = useState<LeaveRequestType[]>([]);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch employee ID, leave types, leave balances and recent requests when component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get employee ID for the current user
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (employeeError) {
          console.error('Error fetching employee:', employeeError);
          return;
        }
        
        if (employeeData) {
          setEmployeeId(employeeData.id);
          
          // Fetch leave types
          const { data: leaveTypesData, error: leaveTypesError } = await supabase
            .from('leave_types')
            .select('*');
          
          if (leaveTypesError) {
            console.error('Error fetching leave types:', leaveTypesError);
          } else if (leaveTypesData && leaveTypesData.length > 0) {
            setLeaveTypes(leaveTypesData);
          }
          
          // Fetch leave balances with leave types
          const { data: balanceData, error: balanceError } = await supabase
            .from('leave_balances')
            .select(`
              id, 
              leave_type_id, 
              total_days, 
              used_days,
              leave_types(name)
            `)
            .eq('employee_id', employeeData.id);
          
          if (balanceError) {
            console.error('Error fetching leave balances:', balanceError);
          } else if (balanceData) {
            const formattedBalances = balanceData.map(balance => ({
              id: balance.id,
              leave_type_id: balance.leave_type_id,
              total_days: balance.total_days,
              used_days: balance.used_days,
              remaining: balance.total_days - balance.used_days,
              type: balance.leave_types.name
            }));
            setLeaveBalance(formattedBalances);
          }
          
          // Fetch recent leave requests
          fetchRecentRequests(employeeData.id);
        }
      } catch (error) {
        console.error('Error in data fetching:', error);
      }
    };

    fetchInitialData();
  }, []);
  
  const fetchRecentRequests = async (empId: string) => {
    const { data: requestsData, error: requestsError } = await supabase
      .from('leaves')
      .select(`
        id,
        start_date,
        end_date,
        status,
        leave_types(name)
      `)
      .eq('employee_id', empId)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (requestsError) {
      console.error('Error fetching leave requests:', requestsError);
    } else if (requestsData) {
      const formattedRequests = requestsData.map(request => ({
        id: request.id,
        start_date: request.start_date,
        end_date: request.end_date,
        status: request.status,
        leave_type: request.leave_types.name
      }));
      setRecentRequests(formattedRequests);
    }
  };

  const handleSubmitSuccess = () => {
    setIsSubmitted(true);
    
    // Reset submission status and refresh recent requests after a delay
    setTimeout(() => {
      setIsSubmitted(false);
      if (employeeId) {
        fetchRecentRequests(employeeId);
      }
    }, 3000);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="cyber-panel p-6">
          <h2 className="text-2xl font-bold flex items-center mb-6">
            <FileText size={24} className="mr-2 text-cyber-neon-purple" />
            <span className="neon-text">Leave</span> Request
          </h2>
          
          <LeaveRequestForm 
            leaveTypes={leaveTypes} 
            employeeId={employeeId} 
            onSubmitSuccess={handleSubmitSuccess} 
            isSubmitted={isSubmitted}
          />
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="cyber-panel p-6">
          <h3 className="text-xl font-bold mb-4 text-cyber-neon-blue">Leave Balance</h3>
          
          <LeaveBalanceDisplay leaveBalance={leaveBalance} />
          
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4 text-cyber-neon-purple">Recent Requests</h3>
            
            <RecentLeaveRequests recentRequests={recentRequests} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
