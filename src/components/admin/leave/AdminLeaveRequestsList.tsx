
import React from 'react';
import { Calendar, CheckCircle, XCircle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminLeaveRequestsListProps {
  leaveRequests: any[];
  onUpdateStatus: (leaveId: string, status: string) => Promise<void>;
  isLoading: boolean;
  isPendingOnly: boolean;
}

const AdminLeaveRequestsList: React.FC<AdminLeaveRequestsListProps> = ({ 
  leaveRequests, 
  onUpdateStatus, 
  isLoading,
  isPendingOnly
}) => {
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const handleApprove = async (leaveId: string) => {
    await onUpdateStatus(leaveId, 'approved');
    toast({
      title: "Leave Approved",
      description: "The leave request has been approved successfully."
    });
  };

  const handleReject = async (leaveId: string) => {
    await onUpdateStatus(leaveId, 'rejected');
    toast({
      title: "Leave Rejected",
      description: "The leave request has been rejected."
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading leave requests...</div>;
  }

  if (leaveRequests.length === 0) {
    return (
      <div className="text-center py-8 border border-cyber-neon-blue/20 bg-cyber-gray-900/50 rounded-md">
        <FileText size={48} className="mx-auto mb-2 text-cyber-neon-blue/40" />
        <p className="text-gray-400">
          {isPendingOnly 
            ? "No pending leave requests found." 
            : "No leave requests found."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        {isPendingOnly ? "Pending Leave Requests" : "All Leave Requests"}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cyber-neon-blue/20">
              <th className="px-4 py-3 text-left">Employee</th>
              <th className="px-4 py-3 text-left">Leave Type</th>
              <th className="px-4 py-3 text-left">Duration</th>
              <th className="px-4 py-3 text-left">Status</th>
              {isPendingOnly && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request) => (
              <tr key={request.id} className="border-b border-cyber-neon-blue/10 hover:bg-cyber-gray-900/30">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <User size={18} className="mr-2 text-cyber-neon-blue" />
                    <div>
                      <div className="font-medium">{request.employees.name}</div>
                      <div className="text-xs text-gray-400">{request.employees.department}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{request.leave_types.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-cyber-neon-purple" />
                    <div>
                      <div>{formatDate(request.start_date)} - {formatDate(request.end_date)}</div>
                      <div className="text-xs text-gray-400">
                        {Math.ceil((new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs border ${getStatusBadgeClass(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </td>
                {isPendingOnly && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="p-1 rounded-full hover:bg-green-500/20 text-green-400"
                        title="Approve"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="p-1 rounded-full hover:bg-red-500/20 text-red-400"
                        title="Reject"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeaveRequestsList;
