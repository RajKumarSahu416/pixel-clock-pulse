
import React from 'react';
import { Edit, Trash, File } from 'lucide-react';
import { LeaveTypeData } from '../types';

interface LeaveTypesListProps {
  leaveTypes: LeaveTypeData[];
  isLoading: boolean;
  onEdit: (leaveType: LeaveTypeData) => void;
  onDelete: (id: string) => void;
}

const LeaveTypesList: React.FC<LeaveTypesListProps> = ({ 
  leaveTypes,
  isLoading,
  onEdit,
  onDelete
}) => {
  return (
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
                        onClick={() => onEdit(leaveType)}
                        className="p-1 rounded-full hover:bg-cyber-neon-blue/20 text-cyber-neon-blue"
                        title="Edit Leave Type"
                        disabled={isLoading}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(leaveType.id)}
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
  );
};

export default LeaveTypesList;
