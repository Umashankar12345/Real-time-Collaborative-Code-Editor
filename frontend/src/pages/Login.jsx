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
    <div className="flex justify-center items-center min-h-screen bg-[var(--bg-primary)] w-full">
      {/* Decorative blurred circles for background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="glass-panel w-full max-w-[440px] p-10 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] relative z-10 animate-fade-in mx-4">
        <div className="flex items-center justify-center gap-3 mb-8 text-[var(--accent-color)] font-bold text-2xl tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white shadow-lg">
            &lt;/&gt;
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">CodeCollab</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[var(--text-accent)] text-2xl font-bold tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-2">
            {isLogin ? 'Enter your credentials to access your workspace' : 'Sign up to start collaborating on code'}
          </p>
        </div>
        
        {error && (
          <div className="text-[var(--error-color)] bg-[var(--error-color)]/10 p-4 rounded-xl mb-6 text-center text-sm font-medium border border-[var(--error-color)]/20 animate-fade-in">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[var(--text-primary)] text-sm font-medium mb-2">
              Username
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 bg-black/20 border border-[var(--border-color)] rounded-xl text-white text-[0.95rem] outline-none transition-all duration-300 focus:border-[var(--accent-color)] focus:bg-black/40 focus:ring-4 focus:ring-[var(--accent-color)]/20 placeholder:text-gray-500"
              placeholder="developer"
              required
            />
          </div>

          <div>
            <label className="flex justify-between text-[var(--text-primary)] text-sm font-medium mb-2">
              Password
              {isLogin && <a href="#" className="text-[var(--accent-color)] no-underline text-[0.8rem] hover:text-[var(--accent-hover)] transition-colors">Forgot password?</a>}
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-black/20 border border-[var(--border-color)] rounded-xl text-white text-[0.95rem] outline-none transition-all duration-300 focus:border-[var(--accent-color)] focus:bg-black/40 focus:ring-4 focus:ring-[var(--accent-color)]/20 placeholder:text-gray-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 mt-2 btn-primary rounded-xl text-base font-semibold tracking-wide"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="flex items-center text-[var(--text-secondary)] text-[0.75rem] my-8 uppercase tracking-widest before:flex-1 before:h-px before:bg-[var(--border-color)] after:flex-1 after:h-px after:bg-[var(--border-color)]">
          <span className="px-4 font-medium">or</span>
        </div>

        <button className="w-full btn-secondary py-3.5 rounded-xl flex items-center justify-center gap-3 group">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="opacity-80 group-hover:opacity-100 transition-opacity"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span className="font-medium">Continue with GitHub</span>
        </button>

        <div className="text-center mt-8 text-[var(--text-secondary)] text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[var(--accent-color)] font-medium hover:text-[var(--accent-hover)] transition-colors ml-1"
          >
            {isLogin ? 'Create one' : 'Log in instead'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
