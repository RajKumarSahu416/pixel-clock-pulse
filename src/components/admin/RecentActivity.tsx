
import React from 'react';

interface ActivityItem {
  user: string;
  action: string;
  time: string;
  image: string;
}

const RecentActivity = () => {
  // Mock recent activities
  const recentActivities: ActivityItem[] = [
    { user: 'Sarah Johnson', action: 'marked attendance', time: '9:02 AM', image: 'https://source.unsplash.com/random/40x40/?woman' },
    { user: 'Michael Chen', action: 'requested sick leave', time: '8:45 AM', image: 'https://source.unsplash.com/random/40x40/?man' },
    { user: 'Emily Brown', action: 'checked out', time: 'Yesterday, 6:15 PM', image: 'https://source.unsplash.com/random/40x40/?woman' },
    { user: 'Robert Singh', action: 'leave approved by you', time: 'Yesterday, 2:30 PM', image: 'https://source.unsplash.com/random/40x40/?man' },
  ];

  return (
    <div className="cyber-panel p-6">
      <h2 className="text-xl font-bold mb-6 neon-text-blue">Recent Activity</h2>
      
      <div className="space-y-4">
        {recentActivities.map((activity, index) => (
          <div key={index} className="flex items-center p-3 bg-cyber-gray-900/30 rounded border border-cyber-neon-blue/10 hover:border-cyber-neon-blue/30 transition-colors">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-cyber-neon-blue/30">
              <img src={activity.image} alt={activity.user} className="w-full h-full object-cover" />
            </div>
            <div className="ml-4">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span> {activity.action}
              </p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
        
        <button className="w-full py-2 text-sm text-cyber-neon-blue hover:text-cyber-neon-purple">
          View All Activity →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
