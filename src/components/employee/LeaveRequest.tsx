
import React, { useState } from 'react';
import { FileText, Calendar, Send, Check } from 'lucide-react';

interface LeaveFormData {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}

const LeaveRequest = () => {
  const [formData, setFormData] = useState<LeaveFormData>({
    type: 'sick',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const leaveTypes = [
    { id: 'sick', name: 'Sick Leave' },
    { id: 'casual', name: 'Casual Leave' },
    { id: 'paid', name: 'Paid Leave' },
    { id: 'unpaid', name: 'Unpaid Leave' },
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, we would submit to Supabase here
    console.log('Submitting leave request:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      console.log('Leave request submitted successfully');
      
      // Reset form after a delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          type: 'sick',
          startDate: '',
          endDate: '',
          reason: '',
        });
      }, 3000);
    }, 1500);
  };
  
  // Mock leave balance data
  const leaveBalance = [
    { type: 'Sick Leave', total: 10, used: 3, remaining: 7 },
    { type: 'Casual Leave', total: 15, used: 5, remaining: 10 },
    { type: 'Paid Leave', total: 20, used: 8, remaining: 12 },
  ];
  
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
            {leaveBalance.map((leave, index) => (
              <div key={index} className="bg-cyber-gray-900/50 p-3 rounded border border-cyber-neon-blue/20">
                <h4 className="text-sm font-medium">{leave.type}</h4>
                <div className="mt-2 h-2 bg-cyber-gray-800 rounded overflow-hidden">
                  <div 
                    className="h-full bg-cyber-neon-blue" 
                    style={{ width: `${(leave.used / leave.total) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span>Used: {leave.used}</span>
                  <span className="text-cyber-neon-blue">Remaining: {leave.remaining}</span>
                  <span>Total: {leave.total}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4 text-cyber-neon-purple">Recent Requests</h3>
            
            <div className="space-y-2">
              <div className="p-3 border border-cyber-neon-orange/30 rounded bg-cyber-neon-orange/5">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Sick Leave</span>
                  <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Pending</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Apr 10 - Apr 12, 2025</p>
              </div>
              
              <div className="p-3 border border-cyber-neon-blue/30 rounded bg-cyber-neon-blue/5">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Casual Leave</span>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Approved</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Mar 22 - Mar 23, 2025</p>
              </div>
              
              <div className="p-3 border border-cyber-neon-pink/30 rounded bg-cyber-neon-pink/5">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Unpaid Leave</span>
                  <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">Rejected</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Feb 15 - Feb 18, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
