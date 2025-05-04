
import React from 'react';
import { DollarSign } from 'lucide-react';

interface PayrollData {
  totalSalary: string;
  averageSalary: string;
  highestPaid: string;
  lowestPaid: string;
}

const PayrollSummary = () => {
  // Mock payroll data
  const payrollSummary: PayrollData = {
    totalSalary: '$284,500',
    averageSalary: '$2,276',
    highestPaid: '$8,500',
    lowestPaid: '$1,200',
  };

  return (
    <div className="cyber-panel p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <DollarSign size={20} className="mr-2 text-cyber-neon-purple" />
        <span className="neon-text">Payroll</span> Summary
      </h2>
      
      <div className="space-y-4">
        <div className="p-3 bg-cyber-gray-900/80 rounded flex justify-between items-center border-l-4 border-cyber-neon-purple">
          <span className="text-gray-400">Total Salary</span>
          <span className="text-lg font-bold">{payrollSummary.totalSalary}</span>
        </div>
        <div className="p-3 bg-cyber-gray-900/60 rounded flex justify-between items-center border-l-2 border-cyber-neon-purple/80">
          <span className="text-gray-400">Average</span>
          <span className="font-medium">{payrollSummary.averageSalary}</span>
        </div>
        <div className="p-3 bg-cyber-gray-900/60 rounded flex justify-between items-center border-l-2 border-cyber-neon-blue/80">
          <span className="text-gray-400">Highest</span>
          <span className="font-medium text-cyber-neon-blue">{payrollSummary.highestPaid}</span>
        </div>
        <div className="p-3 bg-cyber-gray-900/60 rounded flex justify-between items-center border-l-2 border-cyber-neon-pink/80">
          <span className="text-gray-400">Lowest</span>
          <span className="font-medium text-cyber-neon-pink">{payrollSummary.lowestPaid}</span>
        </div>
      </div>
    </div>
  );
};

export default PayrollSummary;
