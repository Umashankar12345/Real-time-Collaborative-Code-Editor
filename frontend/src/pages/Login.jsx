import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please fill all fields');
      return;
    }

    const action = isLogin ? login : register;
    const result = await action(username, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#1e1e1e] font-sans">
      <div className="bg-[#252526] p-10 rounded-2xl w-[400px] border border-[#3e3e42] shadow-2xl transition-all duration-300 hover:shadow-[#007acc]/10">
        <h2 className="text-center mb-8 text-white text-3xl font-bold tracking-tight">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && (
          <div className="text-[#f14c4c] bg-[#f14c4c]/10 p-3 rounded-lg mb-6 text-center text-sm font-medium border border-[#f14c4c]/20">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-2 text-[#858585] text-sm font-medium transition-colors focus-within:text-[#007acc]">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#3e3e42] bg-[#1e1e1e] text-white focus:outline-none focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/30 transition-all placeholder:text-[#454545]"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block mb-2 text-[#858585] text-sm font-medium transition-colors focus-within:text-[#007acc]">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#3e3e42] bg-[#1e1e1e] text-white focus:outline-none focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/30 transition-all placeholder:text-[#454545]"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="mt-4 p-3.5 w-full bg-[#007acc] text-white rounded-xl font-semibold hover:bg-[#0062a3] hover:shadow-lg hover:shadow-[#007acc]/20 transition-all active:scale-[0.98]"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-[#858585] text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[#007acc] hover:text-[#3399ff] hover:underline font-medium transition-colors ml-1"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
