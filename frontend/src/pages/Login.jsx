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
    <div 
      className="flex justify-center items-center min-h-screen font-sans"
      style={{
        backgroundColor: '#0b0f17',
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.08) 0%, transparent 60%), linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 32px 32px, 32px 32px'
      }}
    >
      <div className="w-full max-w-[420px] p-10 bg-[#111827] border border-[#1f2937] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-center gap-2 mb-6 text-[#38bdf8] font-bold text-xl">
          <span>&lt;/&gt;</span> CodeCollab
        </div>

        <div className="text-center mb-7">
          <h1 className="text-[#f9fafb] text-2xl font-semibold">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-[#9ca3af] text-sm mt-1.5">
            {isLogin ? 'Enter your credentials to access your workspace' : 'Sign up to start collaborating on code'}
          </p>
        </div>
        
        {error && (
          <div className="text-[#f14c4c] bg-[#f14c4c]/10 p-3 rounded-lg mb-6 text-center text-sm font-medium border border-[#f14c4c]/20">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="flex justify-between text-[#e5e7eb] text-sm font-medium mb-2">
              Username
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-3 bg-[#1f2937] border border-[#374151] rounded-lg text-white text-[0.95rem] outline-none transition-all duration-200 focus:border-[#38bdf8] focus:shadow-[0_0_0_3px_rgba(56,189,248,0.2)] placeholder:text-[#6b7280]"
              placeholder="developer"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex justify-between text-[#e5e7eb] text-sm font-medium mb-2">
              Password
              {isLogin && <a href="#" className="text-[#38bdf8] no-underline text-[0.8rem] hover:underline">Forgot password?</a>}
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-3 bg-[#1f2937] border border-[#374151] rounded-lg text-white text-[0.95rem] outline-none transition-all duration-200 focus:border-[#38bdf8] focus:shadow-[0_0_0_3px_rgba(56,189,248,0.2)] placeholder:text-[#6b7280]"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full p-3 bg-[#0284c7] text-white font-semibold text-[0.95rem] rounded-lg transition-colors duration-200 hover:bg-[#0369a1]"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="flex items-center text-[#6b7280] text-[0.75rem] my-6 uppercase tracking-[0.05em] before:flex-1 before:h-px before:bg-[#374151] after:flex-1 after:h-px after:bg-[#374151]">
          <span className="px-3">or continue with</span>
        </div>

        <button className="w-full p-2.5 bg-[#1f2937] border border-[#374151] rounded-lg text-[#e5e7eb] text-sm font-medium flex items-center justify-center gap-2.5 cursor-pointer transition-colors duration-200 hover:bg-[#374151]">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </button>

        <div className="text-center mt-6 text-[#9ca3af] text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[#38bdf8] font-medium no-underline hover:underline"
          >
            {isLogin ? 'Create account' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
