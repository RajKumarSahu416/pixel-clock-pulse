
import React from 'react';
import { User, Calendar, FileText, DollarSign, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminTabNavigation: React.FC<AdminTabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-8">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full flex flex-wrap justify-start mb-2 bg-cyber-gray-900/50">
          <TabsTrigger value="dashboard" className="flex-grow-0">
            <User size={16} className="mr-1" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex-grow-0">
            <Users size={16} className="mr-1" />
            Employees
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex-grow-0">
            <Calendar size={16} className="mr-1" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="leave" className="flex-grow-0">
            <FileText size={16} className="mr-1" />
            Leave
          </TabsTrigger>
          <TabsTrigger value="payroll" className="flex-grow-0">
            <DollarSign size={16} className="mr-1" />
            Payroll
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AdminTabNavigation;
