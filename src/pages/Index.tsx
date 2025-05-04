
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn } from 'lucide-react';

const Index = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEmployee, setIsEmployee] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login (will integrate with Supabase in Phase 2)
    setTimeout(() => {
      setIsLoading(false);
      
      // In Phase 2, this will be replaced with actual Supabase authentication
      if (isEmployee) {
        navigate('/employee');
      } else {
        navigate('/admin');
      }
    }, 1500);
  };

  const toggleUserType = () => {
    setIsEmployee(!isEmployee);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cyber-bg-dark opacity-90"></div>
        <div className="absolute inset-0" 
          style={{
            backgroundImage: "linear-gradient(to right, rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }}>
        </div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-auto">
        <div className="cyber-panel p-8 backdrop-blur-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="neon-text">Cyber</span>
              <span className="neon-text-blue">Salary</span>
            </h1>
            <p className="text-gray-400">Next-gen employee management system</p>
          </div>

          <div className="mb-6">
            <button 
              onClick={toggleUserType}
              className="w-full bg-cyber-gray-800 border border-cyber-neon-blue/30 rounded-md overflow-hidden relative"
            >
              <div className="grid grid-cols-2">
                <div 
                  className={`py-3 text-center ${isEmployee ? 'text-white bg-cyber-neon-purple/20' : 'text-gray-400'}`}
                  onClick={() => setIsEmployee(true)}
                >
                  Employee
                </div>
                <div 
                  className={`py-3 text-center ${!isEmployee ? 'text-white bg-cyber-neon-blue/20' : 'text-gray-400'}`}
                  onClick={() => setIsEmployee(false)}
                >
                  Admin
                </div>
              </div>
              <div 
                className={`absolute bottom-0 h-0.5 bg-gradient-to-r ${
                  isEmployee 
                    ? 'from-cyber-neon-purple to-cyber-neon-purple/50 w-1/2 left-0' 
                    : 'from-cyber-neon-blue/50 to-cyber-neon-blue w-1/2 left-1/2'
                }`}
              ></div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder={isEmployee ? "employee@example.com" : "admin@example.com"}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-cyber-gray-900 border border-cyber-neon-purple/30 rounded-md focus:border-cyber-neon-purple focus:ring-1 focus:ring-cyber-neon-purple focus:outline-none"
                  required
                />
                <User size={18} className="absolute left-3 top-3.5 text-cyber-neon-purple/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-cyber-gray-900 border border-cyber-neon-purple/30 rounded-md focus:border-cyber-neon-purple focus:ring-1 focus:ring-cyber-neon-purple focus:outline-none"
                  required
                />
                <Lock size={18} className="absolute left-3 top-3.5 text-cyber-neon-purple/50" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`cyber-button flex items-center justify-center w-full ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-cyber-neon-purple border-t-transparent rounded-full"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn size={18} className="mr-2" />
                    Log In
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-3 bg-cyber-gray-800/50 border border-cyber-neon-blue/20 rounded-md">
            <h3 className="text-cyber-neon-blue text-sm mb-2">Demo Credentials</h3>
            <div className="text-xs text-gray-300 space-y-1">
              <p>Employee: employee@example.com / password</p>
              <p>Admin: admin@example.com / password</p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            <p>For demo purposes only. Phase 2 will include Supabase integration.</p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border border-cyber-neon-purple/30 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 border border-cyber-neon-blue/20 rounded-full opacity-10"></div>
    </div>
  );
};

export default Index;
