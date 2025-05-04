
import React from 'react';
import { Users, CheckCircle, Calendar, Clock } from 'lucide-react';

interface SummaryItem {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  change: string;
}

const DashboardSummary = () => {
  // Mock summary data
  const summaryData: SummaryItem[] = [
    { title: 'Total Employees', value: 125, icon: <Users size={24} />, color: 'cyber-neon-blue', change: '+8% from last month' },
    { title: 'Present Today', value: 112, icon: <CheckCircle size={24} />, color: 'cyber-neon-purple', change: '89.6% attendance rate' },
    { title: 'On Leave', value: 8, icon: <Calendar size={24} />, color: 'cyber-neon-orange', change: '6.4% of workforce' },
    { title: 'Pending Requests', value: 15, icon: <Clock size={24} />, color: 'cyber-neon-pink', change: '12 leave, 3 attendance' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((item, index) => (
        <div key={index} className="cyber-panel p-5 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full bg-${item.color}`}></div>
          <div className="flex items-start">
            <div className={`p-3 rounded-lg bg-${item.color}/10 text-${item.color}`}>
              {item.icon}
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-400">{item.title}</h3>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.change}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummary;
