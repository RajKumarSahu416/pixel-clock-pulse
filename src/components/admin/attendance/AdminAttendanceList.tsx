
import React, { useState } from 'react';
import { Calendar, User, ImageIcon, CheckCircle2, X } from 'lucide-react';
import { format } from 'date-fns';

interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in_time: string;
  check_out_time: string | null;
  check_in_photo: string | null;
  check_out_photo: string | null;
  status: string;
  employees: {
    name: string;
    department: string;
  };
}

interface AdminAttendanceListProps {
  attendanceRecords: AttendanceRecord[];
  isLoading: boolean;
}

const AdminAttendanceList: React.FC<AdminAttendanceListProps> = ({ attendanceRecords, isLoading }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'hh:mm a');
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'present':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'absent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'late':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading attendance records...</div>;
  }

  if (attendanceRecords.length === 0) {
    return (
      <div className="text-center py-8 border border-cyber-neon-blue/20 bg-cyber-gray-900/50 rounded-md">
        <Calendar size={48} className="mx-auto mb-2 text-cyber-neon-blue/40" />
        <p className="text-gray-400">No attendance records found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Attendance Records</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cyber-neon-blue/20">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Employee</th>
              <th className="px-4 py-3 text-left">Check In</th>
              <th className="px-4 py-3 text-left">Check Out</th>
              <th className="px-4 py-3 text-left">Photos</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record.id} className="border-b border-cyber-neon-blue/10 hover:bg-cyber-gray-900/30">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-cyber-neon-purple" />
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <User size={16} className="mr-2 text-cyber-neon-blue" />
                    <div>
                      <div className="font-medium">{record.employees?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-400">{record.employees?.department || 'Unknown'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {formatTime(record.check_in_time)}
                </td>
                <td className="px-4 py-3">
                  {formatTime(record.check_out_time)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {record.check_in_photo ? (
                      <button 
                        onClick={() => setPreviewImage(record.check_in_photo)}
                        className="p-1 rounded-full hover:bg-cyber-neon-blue/20 text-cyber-neon-blue"
                        title="View check-in photo"
                      >
                        <ImageIcon size={16} />
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">No check-in photo</span>
                    )}
                    
                    {record.check_out_photo && (
                      <button
                        onClick={() => setPreviewImage(record.check_out_photo)}
                        className="p-1 rounded-full hover:bg-cyber-neon-pink/20 text-cyber-neon-pink"
                        title="View check-out photo"
                      >
                        <ImageIcon size={16} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs border ${getStatusBadgeClass(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-3xl max-h-[80vh] w-full">
            <button 
              onClick={() => setPreviewImage(null)} 
              className="absolute top-4 right-4 bg-black/50 rounded-full p-1 text-white hover:bg-red-600/80"
            >
              <X size={24} />
            </button>
            <img 
              src={previewImage} 
              alt="Attendance photo" 
              className="w-full h-full object-contain rounded-lg border-2 border-cyber-neon-blue/50"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendanceList;
