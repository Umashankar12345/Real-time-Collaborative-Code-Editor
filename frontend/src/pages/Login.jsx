import React, { useState, useContext, useRef, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Box, Sphere, Cylinder, Torus, Float, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';

const GlowingObject = ({ children, color, intensity = 2 }) => {
  return (
    <group>
      {children}
      <pointLight color={color} intensity={intensity} distance={5} />
    </group>
  );
};

const FloatingScene = () => {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Blue/Cyan Sphere */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <GlowingObject color="#00F5FF" intensity={1.5}>
          <Sphere args={[1.2, 64, 64]} position={[-4, 2, -3]} castShadow receiveShadow>
            <meshPhysicalMaterial 
              color="#00A8FF" 
              emissive="#0055ff" 
              emissiveIntensity={0.2}
              roughness={0.1} 
              metalness={0.9} 
              clearcoat={1}
            />
          </Sphere>
        </GlowingObject>
      </Float>
      
      {/* 2. Gradient Cube (Approximated with Pink/Purple metallic) */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
        <GlowingObject color="#8B5CF6" intensity={2}>
          <Box args={[1.5, 1.5, 1.5]} position={[4, 1.5, -4]} castShadow receiveShadow>
            <meshPhysicalMaterial 
              color="#A855F7" 
              emissive="#EC4899"
              emissiveIntensity={0.3}
              roughness={0.2} 
              metalness={0.8}
            />
          </Box>
        </GlowingObject>
      </Float>

      {/* 3. Neon Green Shape (Cone) */}
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <GlowingObject color="#22C55E" intensity={1}>
          <Cylinder args={[0, 0.8, 2, 32]} position={[-3.5, -2, -2]} castShadow receiveShadow>
            <meshPhysicalMaterial 
              color="#22C55E" 
              emissive="#00F5FF"
              emissiveIntensity={0.4}
              roughness={0.3} 
              metalness={0.7} 
            />
          </Cylinder>
        </GlowingObject>
      </Float>

      {/* 4. Orange/Pink Torus */}
      <Float speed={1} rotationIntensity={2} floatIntensity={2}>
        <GlowingObject color="#F97316" intensity={1.5}>
          <Torus args={[0.8, 0.3, 32, 64]} position={[3.5, -2.5, -1]} castShadow receiveShadow>
            <meshPhysicalMaterial 
              color="#FF4D8D" 
              emissive="#F97316"
              emissiveIntensity={0.5}
              roughness={0.1} 
              metalness={0.8} 
            />
          </Torus>
        </GlowingObject>
      </Float>

      {/* Developer Symbols */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
        <Text position={[-2, 0.5, 2]} fontSize={0.8} color="#00F5FF" anchorX="center" anchorY="middle">
          {'</>'}
          <meshPhysicalMaterial color="#00F5FF" emissive="#00F5FF" emissiveIntensity={0.8} toneMapped={false} />
        </Text>
      </Float>
      
      <Float speed={2.5} rotationIntensity={1} floatIntensity={1.5}>
        <Text position={[2.5, -0.5, 1.5]} fontSize={1} color="#EC4899" anchorX="center" anchorY="middle">
          {'{ }'}
          <meshPhysicalMaterial color="#EC4899" emissive="#EC4899" emissiveIntensity={0.8} toneMapped={false} />
        </Text>
      </Float>
      
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1}>
        <Text position={[-1.5, -2.5, 1]} fontSize={0.7} color="#F97316" anchorX="center" anchorY="middle">
          JS
          <meshPhysicalMaterial color="#F97316" emissive="#F97316" emissiveIntensity={0.8} toneMapped={false} />
        </Text>
      </Float>

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <Text position={[1.5, 3, 0]} fontSize={0.6} color="#22C55E" anchorX="center" anchorY="middle">
          01
          <meshPhysicalMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={0.8} toneMapped={false} />
        </Text>
      </Float>

      <Sparkles count={150} scale={12} size={3} speed={0.5} opacity={0.6} color="#00F5FF" />
      <Sparkles count={100} scale={15} size={2} speed={0.3} opacity={0.4} color="#EC4899" />
    </group>
  );
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      if (!username || !password) {
        setError('Please fill all fields');
        return;
      }
    } else {
      if (!fullName || !email || !username || !password || !confirmPassword) {
        setError('Please fill all fields');
        return;
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setIsSubmitting(true);
    
    let result;
    if (isLogin) {
      result = await login(username, password);
    } else {
      result = await register({ fullName, email, username, password });
    }
    
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#1A0B2E] to-[#0F172A]">
      
      {/* Colorful Atmospheric Glows */}
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-[#00A8FF]/20 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-[#8B5CF6]/20 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[5%] right-[10%] w-[35vw] h-[35vw] bg-[#EC4899]/20 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[20%] w-[45vw] h-[45vw] bg-[#00F5FF]/15 rounded-full mix-blend-screen filter blur-[140px] pointer-events-none"></div>

      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
          {/* Cinematic Lighting */}
          <ambientLight intensity={0.2} color="#ffffff" />
          <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={2} color="#00A8FF" castShadow />
          <spotLight position={[10, 10, -10]} angle={0.3} penumbra={1} intensity={2} color="#EC4899" castShadow />
          <pointLight position={[0, -10, 5]} intensity={1.5} color="#00F5FF" />
          <pointLight position={[5, 0, 5]} intensity={1} color="#8B5CF6" />
          
          <Environment preset="night" />
          <FloatingScene />
        </Canvas>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[440px] p-10 rounded-2xl relative z-10 animate-fade-in mx-4 
                      bg-[#13111C]/60 backdrop-blur-2xl border border-[#8B5CF6]/30 
                      shadow-[0_0_40px_rgba(139,92,246,0.15)] 
                      before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/5 before:pointer-events-none">
        
        <div className="flex items-center justify-center gap-3 mb-8 text-2xl tracking-tight relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A8FF] to-[#8B5CF6] flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,168,255,0.4)]">
            &lt;/&gt;
          </div>
          <span className="text-white font-bold">CodeCollab <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A8FF] via-[#8B5CF6] to-[#EC4899]">3D</span></span>
        </div>

        <div className="text-center mb-8 relative">
          <h1 className="text-white text-2xl font-bold tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-[#A1A1AA] text-sm mt-2">
            {isLogin ? 'Enter your credentials to access your workspace' : 'Sign up to start collaborating on code'}
          </p>
        </div>
        
        {error && (
          <div className="text-[#FF4D8D] bg-[#FF4D8D]/10 p-4 rounded-xl mb-6 text-center text-sm font-medium border border-[#FF4D8D]/20 animate-fade-in relative">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5 relative">
          {!isLogin && (
            <>
              <div>
                <label className="block text-[#E4E4E7] text-sm font-medium mb-2">
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#09090B]/60 border border-[#3F3F46]/50 rounded-xl text-white text-[0.95rem] outline-none transition-all duration-300 focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF]/50 placeholder:text-[#52525B]"
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
              <div>
                <label className="block text-[#E4E4E7] text-sm font-medium mb-2">
                  Email
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#09090B]/60 border border-[#3F3F46]/50 rounded-xl text-white text-[0.95rem] outline-none transition-all duration-300 focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF]/50 placeholder:text-[#52525B]"
                  placeholder="john@example.com"
                  required={!isLogin}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[#E4E4E7] text-sm font-medium mb-2">
              Username
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#09090B]/60 border border-[#3F3F46]/50 rounded-xl text-white text-[0.95rem] outline-none transition-all duration-300 focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF]/50 placeholder:text-[#52525B]"
              placeholder="developer"
              required
            />
          </div>

          <div>
            <label className="flex justify-between text-[#E4E4E7] text-sm font-medium mb-2">
              Password
              {isLogin && <a href="#" className="text-[#00F5FF] no-underline text-[0.8rem] hover:text-[#00A8FF] transition-colors">Forgot password?</a>}
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#09090B]/60 border border-[#3F3F46]/50 rounded-xl text-white text-[0.95rem] outline-none transition-all duration-300 focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF]/50 placeholder:text-[#52525B]"
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[#E4E4E7] text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#09090B]/60 border border-[#3F3F46]/50 rounded-xl text-white text-[0.95rem] outline-none transition-all duration-300 focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF]/50 placeholder:text-[#52525B]"
                placeholder="••••••••"
                required={!isLogin}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#00A8FF] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#EC4899] text-white rounded-xl text-base font-semibold tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        
        <div className="flex items-center text-[#71717A] text-[0.75rem] my-8 uppercase tracking-widest before:flex-1 before:h-px before:bg-[#3F3F46]/50 after:flex-1 after:h-px after:bg-[#3F3F46]/50 relative">
          <span className="px-4 font-medium">or</span>
        </div>

        <button className="relative w-full bg-[#18181B]/80 hover:bg-[#27272A]/90 border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] text-[#E4E4E7] py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all duration-300">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span className="font-medium">Continue with GitHub</span>
        </button>

        <div className="text-center mt-8 text-[#A1A1AA] text-sm relative">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[#00F5FF] font-medium hover:text-[#00A8FF] transition-colors ml-1"
          >
            {isLogin ? 'Create one' : 'Log in instead'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
