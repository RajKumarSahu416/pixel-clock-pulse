
import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Send, Check } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LeaveFormData {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface LeaveType {
  id: string;
  name: string;
  description: string | null;
}

interface LeaveBalance {
  id: string;
  leave_type_id: string;
  total_days: number;
  used_days: number;
  remaining: number; // Calculated field
  type: string; // Added from join
}

interface LeaveRequest {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  leave_type: string; // From join
}

const LeaveRequest = () => {
  const [formData, setFormData] = useState<LeaveFormData>({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([]);
  const [recentRequests, setRecentRequests] = useState<LeaveRequest[]>([]);
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
            setFormData(prev => ({ ...prev, type: leaveTypesData[0].id }));
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
          const { data: requestsData, error: requestsError } = await supabase
            .from('leaves')
            .select(`
              id,
              start_date,
              end_date,
              status,
              leave_types(name)
            `)
            .eq('employee_id', employeeData.id)
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
        }
      } catch (error) {
        console.error('Error in data fetching:', error);
      }
    };

    fetchInitialData();
  }, []);
  
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
      
      setIsSubmitted(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          type: leaveTypes.length > 0 ? leaveTypes[0].id : '',
          startDate: '',
          endDate: '',
          reason: '',
        });
        
        // Refresh recent requests
        const fetchUpdatedRequests = async () => {
          const { data: requestsData } = await supabase
            .from('leaves')
            .select(`
              id,
              start_date,
              end_date,
              status,
              leave_types(name)
            `)
            .eq('employee_id', employeeId)
            .order('created_at', { ascending: false })
            .limit(3);
          
          if (requestsData) {
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
        
        fetchUpdatedRequests();
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
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status class based on status value
  const getStatusClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500/20 text-green-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      case 'pending':
      default:
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };
  
  // Get border class based on status value
  const getBorderClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return 'border-cyber-neon-blue/30 bg-cyber-neon-blue/5';
      case 'rejected':
        return 'border-cyber-neon-pink/30 bg-cyber-neon-pink/5';
      case 'pending':
      default:
        return 'border-cyber-neon-orange/30 bg-cyber-neon-orange/5';
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="cyber-panel p-6">
          <h2 className="text-2xl font-bold flex items-center mb-6">
            <FileText size={24} className="mr-2 text-cyber-neon-purple" />
            <span className="neon-text">Leave</span> Request
          </h2>
          
          {isSubmitted ? (
            <div className="bg-cyber-neon-blue/10 border border-cyber-neon-blue p-4 rounded flex items-center mb-6">
              <Check size={20} className="text-cyber-neon-blue mr-2" />
              <p>Your leave request has been submitted successfully!</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="cyber-panel p-6">
          <h3 className="text-xl font-bold mb-4 text-cyber-neon-blue">Leave Balance</h3>
          
          <div className="space-y-4">
            {leaveBalance.length > 0 ? (
              leaveBalance.map((leave) => (
                <div key={leave.id} className="bg-cyber-gray-900/50 p-3 rounded border border-cyber-neon-blue/20">
                  <h4 className="text-sm font-medium">{leave.type}</h4>
                  <div className="mt-2 h-2 bg-cyber-gray-800 rounded overflow-hidden">
                    <div 
                      className="h-full bg-cyber-neon-blue" 
                      style={{ width: `${(leave.used_days / leave.total_days) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span>Used: {leave.used_days}</span>
                    <span className="text-cyber-neon-blue">Remaining: {leave.remaining}</span>
                    <span>Total: {leave.total_days}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-400">
                <p>No leave balance data available</p>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4 text-cyber-neon-purple">Recent Requests</h3>
            
            <div className="space-y-2">
              {recentRequests.length > 0 ? (
                recentRequests.map((request) => (
                  <div key={request.id} className={`p-3 border rounded ${getBorderClass(request.status)}`}>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{request.leave_type}</span>
                      <span className={`text-xs px-2 py-1 ${getStatusClass(request.status)} rounded`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(request.start_date)} - {formatDate(request.end_date)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-400">
                  <p>No recent leave requests</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
