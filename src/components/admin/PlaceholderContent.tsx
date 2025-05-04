
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PlaceholderContentProps {
  title: string;
  icon: React.ReactNode;
  color: string;
}

const PlaceholderContent: React.FC<PlaceholderContentProps> = ({ title, icon, color }) => {
  return (
    <div className="cyber-panel p-8 text-center">
      <h2 className={`text-2xl font-bold text-cyber-neon-${color} mb-4`}>{title}</h2>
      <p className="text-gray-400 mb-6">This feature will be available in Phase 2</p>
      <div className="w-16 h-16 mx-auto">
        {icon}
      </div>
    </div>
  );
};

export default PlaceholderContent;
