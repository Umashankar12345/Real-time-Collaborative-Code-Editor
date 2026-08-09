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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '40px', borderRadius: '8px', width: '400px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-accent)' }}>
          {isLogin ? 'Login to CodeCollab' : 'Create an Account'}
        </h2>
        
        {error && <div style={{ color: 'var(--error-color)', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'white' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '8px', padding: '12px' }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}>
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
