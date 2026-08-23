import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  Home, FolderKanban, Users, Mail, Folder, Star, LayoutTemplate, 
  User, Settings, CreditCard, LogOut, Search, Bell, HelpCircle, 
  ChevronRight, Plus, Link, FilePlus, Download, MoreHorizontal,
  Circle
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Torus, Float, Environment, Text } from '@react-three/drei';

const Mini3DIllustration = () => {
  const groupRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.2;
      groupRef.current.position.y = Math.sin(t * 1) * 0.1;
    }
  });

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 2]} intensity={1} />
      <pointLight position={[-2, -2, -2]} color="#EC4899" intensity={2} />
      <Environment preset="city" />
      <group ref={groupRef}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Box args={[1.5, 1, 0.1]} position={[0, 0.5, 0]} material-color="#1e1e24" material-roughness={0.2} material-metalness={0.8} />
          <Text position={[0, 0.5, 0.06]} fontSize={0.3} color="#00F5FF">{'</>'}</Text>
        </Float>
        <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
          <Box args={[0.5, 0.5, 0.5]} position={[-1, 1.5, -1]} material-color="#00A8FF" material-roughness={0.2} material-metalness={0.8} />
        </Float>
        <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1}>
          <Sphere args={[0.3, 32, 32]} position={[1.5, 1, 1]} material-color="#8B5CF6" material-roughness={0.2} material-metalness={0.8} />
        </Float>
        <Float speed={1} rotationIntensity={2} floatIntensity={2}>
          <Torus args={[0.3, 0.1, 16, 32]} position={[1, -0.5, 0.5]} material-color="#00F5FF" material-roughness={0.2} material-metalness={0.8} />
        </Float>
      </group>
    </Canvas>
  );
};

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateRoom = () => {
    const roomId = `room-${Math.floor(Math.random() * 10000)}`;
    navigate(`/room/${roomId}`);
  };

  const getAvatarInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen w-full bg-[#09090B] text-[#E4E4E7] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-[260px] bg-[#0F0F13] border-r border-[#27272A] flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-[#27272A]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A8FF] to-[#8B5CF6] flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(0,168,255,0.3)]">
            &lt;/&gt;
          </div>
          <span className="font-bold text-lg tracking-wide">CodeCollab <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A8FF] to-[#8B5CF6]">3D</span></span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <div className="mb-2">
            <div className="flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-[#8B5CF6]/20 to-transparent border-l-2 border-[#8B5CF6] text-white rounded-r-lg cursor-pointer">
              <Home size={18} className="text-[#8B5CF6]" />
              <span className="font-medium">Dashboard</span>
            </div>
          </div>

          <div className="mt-6 mb-2">
            <span className="px-3 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">Workspace</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <FolderKanban size={18} /> <span>My Rooms</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <Users size={18} /> <span>Join Room</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Mail size={18} /> <span>Invitations</span>
              </div>
              <span className="bg-[#27272A] text-xs px-2 py-0.5 rounded-full text-white">2</span>
            </div>
          </div>

          <div className="mt-6 mb-2">
            <span className="px-3 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">Projects</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <Folder size={18} /> <span>My Projects</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <Star size={18} /> <span>Starred</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <LayoutTemplate size={18} /> <span>Templates</span>
            </div>
          </div>

          <div className="mt-6 mb-2">
            <span className="px-3 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">Account</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <User size={18} /> <span>Profile</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <Settings size={18} /> <span>Settings</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <CreditCard size={18} /> <span>Billing</span>
            </div>
            <div onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-[#A1A1AA] hover:text-[#f14c4c] hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <LogOut size={18} /> <span>Log out</span>
            </div>
          </div>
        </div>

        <div className="p-4 m-4 bg-gradient-to-br from-[#18181B] to-[#0F0F13] border border-[#27272A] rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full mix-blend-screen filter blur-2xl -mr-10 -mt-10 group-hover:bg-[#8B5CF6]/20 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-white font-bold">
              <span className="text-[#F59E0B]">👑</span> Upgrade to Pro
            </div>
            <p className="text-xs text-[#A1A1AA] mb-4 leading-relaxed">
              Unlock unlimited rooms, advanced collaboration and more.
            </p>
            <button className="w-full py-2 bg-gradient-to-r from-[#00A8FF] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#EC4899] text-white text-xs font-bold rounded-lg transition-all shadow-[0_0_10px_rgba(139,92,246,0.3)]">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090B]">
        
        {/* HEADER */}
        <div className="h-16 border-b border-[#27272A] flex items-center justify-between px-8 bg-[#0F0F13]/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#18181B] border border-[#27272A] rounded-full px-4 py-1.5 text-sm text-[#A1A1AA]">
              <Search size={16} />
              <input type="text" placeholder="Search rooms, projects..." className="bg-transparent border-none outline-none w-48 text-white placeholder-[#71717A]" />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="relative cursor-pointer text-[#A1A1AA] hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00A8FF] text-[9px] text-white font-bold flex items-center justify-center rounded-full border-2 border-[#0F0F13]">3</span>
              </div>
              <div className="cursor-pointer text-[#A1A1AA] hover:text-white transition-colors">
                <HelpCircle size={20} />
              </div>
            </div>
            
            <div className="h-8 w-px bg-[#27272A]"></div>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-white group-hover:text-[#00A8FF] transition-colors">{user?.fullName || 'Developer'}</span>
                <span className="text-[10px] text-[#A1A1AA]">{user?.email || 'dev@codecollab.com'}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white font-bold border-2 border-[#18181B] shadow-sm">
                {getAvatarInitials(user?.fullName)}
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          
          {/* Welcome Section */}
          <div className="bg-[#0F0F13] border border-[#27272A] rounded-2xl p-8 mb-8 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A8FF]/5 rounded-full filter blur-3xl mix-blend-screen pointer-events-none"></div>
            
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                Welcome back, {user?.fullName || user?.username}! <span>👋</span>
              </h1>
              <p className="text-[#A1A1AA]">Let's build something amazing together.</p>
            </div>
            
            <div className="w-[300px] h-[150px] relative z-10 opacity-90">
               <Mini3DIllustration />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-10">
            <h2 className="text-sm font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div onClick={handleCreateRoom} className="bg-gradient-to-br from-[#0F0F13] to-[#0B1528] border border-[#1E3A8A]/30 hover:border-[#00A8FF]/50 p-5 rounded-xl cursor-pointer group transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_25px_rgba(0,168,255,0.1)]">
                <div className="w-10 h-10 rounded-lg bg-[#00A8FF]/10 text-[#00A8FF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users size={20} />
                </div>
                <h3 className="font-bold text-white mb-1 group-hover:text-[#00A8FF] transition-colors">Create Room</h3>
                <p className="text-xs text-[#A1A1AA] mb-4">Start a new collaborative session</p>
                <div className="flex justify-end text-[#00A8FF] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0F0F13] to-[#2E1065]/30 border border-[#4C1D95]/30 hover:border-[#8B5CF6]/50 p-5 rounded-xl cursor-pointer group transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.1)]">
                <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Link size={20} />
                </div>
                <h3 className="font-bold text-white mb-1 group-hover:text-[#8B5CF6] transition-colors">Join Room</h3>
                <p className="text-xs text-[#A1A1AA] mb-4">Join with room ID or invitation link</p>
                <div className="flex justify-end text-[#8B5CF6] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0F0F13] to-[#064E3B]/30 border border-[#047857]/30 hover:border-[#10B981]/50 p-5 rounded-xl cursor-pointer group transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.1)]">
                <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FilePlus size={20} />
                </div>
                <h3 className="font-bold text-white mb-1 group-hover:text-[#10B981] transition-colors">New Project</h3>
                <p className="text-xs text-[#A1A1AA] mb-4">Create a new project from scratch</p>
                <div className="flex justify-end text-[#10B981] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0F0F13] to-[#7C2D12]/30 border border-[#B45309]/30 hover:border-[#F59E0B]/50 p-5 rounded-xl cursor-pointer group transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.1)]">
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Download size={20} />
                </div>
                <h3 className="font-bold text-white mb-1 group-hover:text-[#F59E0B] transition-colors">Import Project</h3>
                <p className="text-xs text-[#A1A1AA] mb-4">Import from GitHub or your device</p>
                <div className="flex justify-end text-[#F59E0B] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>

            </div>
          </div>

          {/* Recent Rooms */}
          <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-sm font-bold text-white">Recent Rooms</h2>
              <span className="text-xs text-[#00A8FF] hover:text-white cursor-pointer font-medium flex items-center gap-1">View all <ChevronRight size={12} /></span>
            </div>
            
            <div className="bg-[#0F0F13] border border-[#27272A] rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#27272A] text-[10px] text-[#71717A] uppercase tracking-wider">
                    <th className="py-3 px-6 font-semibold">Room Name</th>
                    <th className="py-3 px-6 font-semibold">Last Activity</th>
                    <th className="py-3 px-6 font-semibold">Members</th>
                    <th className="py-3 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { id: 'default-room-913', name: 'default-room-913', desc: 'You created this room', time: '2 min ago', active: true, color: 'bg-blue-500' },
                    { id: 'webgl-playground', name: 'WebGL Playground', desc: 'Aman Sharma', time: '1 hour ago', active: false, color: 'bg-pink-500' },
                    { id: 'threejs-learning', name: 'Three.js Learning', desc: 'Riya Patel', time: '3 hours ago', active: false, color: 'bg-green-500' }
                  ].map((room, i) => (
                    <tr key={room.id} className="border-b border-[#27272A] hover:bg-[#18181B]/50 transition-colors">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${room.color} flex items-center justify-center text-white`}>
                            <FolderKanban size={14} />
                          </div>
                          <div>
                            <div className="font-bold text-[#E4E4E7]">{room.name}</div>
                            <div className="text-xs text-[#71717A]">{room.desc}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-[#A1A1AA] text-xs">
                        <span className={room.active ? 'text-[#22C55E]' : ''}>{room.time}</span>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gray-600 border border-[#0F0F13] flex items-center justify-center text-[10px] font-bold">U</div>
                          <div className="w-6 h-6 rounded-full bg-blue-600 border border-[#0F0F13] flex items-center justify-center text-[10px] font-bold">A</div>
                          <div className="w-6 h-6 rounded-full bg-[#27272A] border border-[#0F0F13] flex items-center justify-center text-[10px] text-[#A1A1AA]">+2</div>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => navigate(`/room/${room.id}`)} className="px-3 py-1 bg-[#1E3A8A]/30 text-[#00A8FF] hover:bg-[#1E3A8A]/50 border border-[#1E3A8A]/50 rounded text-xs font-medium transition-colors">
                            Open
                          </button>
                          <button className="p-1 text-[#71717A] hover:text-white transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Templates */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-sm font-bold text-white">Templates</h2>
              <span className="text-xs text-[#00A8FF] hover:text-white cursor-pointer font-medium flex items-center gap-1">View all <ChevronRight size={12} /></span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0F0F13] border border-[#27272A] hover:border-[#22C55E]/50 p-4 rounded-xl cursor-pointer group transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center">
                    <Box size={20} />
                  </div>
                  <span className="text-[10px] font-bold bg-[#18181B] border border-[#27272A] px-2 py-0.5 rounded text-[#22C55E]">3D</span>
                </div>
                <h3 className="font-bold text-[#E4E4E7] mb-1 group-hover:text-[#22C55E] transition-colors">Three.js Starter</h3>
                <p className="text-xs text-[#71717A]">Basic Three.js scene with lights and camera</p>
              </div>

              <div className="bg-[#0F0F13] border border-[#27272A] hover:border-[#8B5CF6]/50 p-4 rounded-xl cursor-pointer group transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                    <Sphere size={20} />
                  </div>
                  <span className="text-[10px] font-bold bg-[#18181B] border border-[#27272A] px-2 py-0.5 rounded text-[#8B5CF6]">3D</span>
                </div>
                <h3 className="font-bold text-[#E4E4E7] mb-1 group-hover:text-[#8B5CF6] transition-colors">WebGL Starter</h3>
                <p className="text-xs text-[#71717A]">WebGL project setup with modern tools</p>
              </div>

              <div className="bg-[#0F0F13] border border-[#27272A] hover:border-[#00A8FF]/50 p-4 rounded-xl cursor-pointer group transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00A8FF]/10 text-[#00A8FF] flex items-center justify-center font-bold text-lg">
                    ⚛
                  </div>
                  <span className="text-[10px] font-bold bg-[#18181B] border border-[#27272A] px-2 py-0.5 rounded text-[#00A8FF]">3D</span>
                </div>
                <h3 className="font-bold text-[#E4E4E7] mb-1 group-hover:text-[#00A8FF] transition-colors">React + Three Fiber</h3>
                <p className="text-xs text-[#71717A]">React Three Fiber boilerplate</p>
              </div>

              <div className="bg-[#0F0F13] border border-[#27272A] hover:border-[#F59E0B]/50 p-4 rounded-xl cursor-pointer group transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
                    JS
                  </div>
                  <span className="text-[10px] font-bold bg-[#18181B] border border-[#27272A] px-2 py-0.5 rounded text-[#F59E0B]">JS</span>
                </div>
                <h3 className="font-bold text-[#E4E4E7] mb-1 group-hover:text-[#F59E0B] transition-colors">Vanilla JS Starter</h3>
                <p className="text-xs text-[#71717A]">Clean JavaScript project template</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-[280px] bg-[#0F0F13] border-l border-[#27272A] flex flex-col shrink-0">
        
        {/* Activity Feed */}
        <div className="p-6 border-b border-[#27272A]">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-sm font-bold text-white">Activity Feed</h2>
            <span className="text-xs text-[#00A8FF] hover:text-white cursor-pointer font-medium flex items-center gap-1">View all <ChevronRight size={12} /></span>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">A</div>
              <div>
                <p className="text-xs text-[#E4E4E7] leading-tight"><span className="font-bold">Aman Sharma</span> joined the room <span className="text-[#A1A1AA]">WebGL Playground</span></p>
                <span className="text-[10px] text-[#71717A]">2m ago</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-pink-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">R</div>
              <div>
                <p className="text-xs text-[#E4E4E7] leading-tight"><span className="font-bold">Riya Patel</span> pushed changes in <span className="text-[#A1A1AA]">Three.js Learning</span></p>
                <span className="text-[10px] text-[#71717A]">15m ago</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">Y</div>
              <div>
                <p className="text-xs text-[#E4E4E7] leading-tight"><span className="font-bold">You</span> created a new room <span className="text-[#00A8FF]">default-room-913</span></p>
                <span className="text-[10px] text-[#71717A]">2h ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Online Members */}
        <div className="p-6 border-b border-[#27272A] flex-1">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-sm font-bold text-white">Online Members</h2>
            <span className="text-xs text-[#00A8FF] hover:text-white cursor-pointer font-medium flex items-center gap-1">View all <ChevronRight size={12} /></span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">A</div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] border-2 border-[#0F0F13] rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#E4E4E7]">Aman Sharma</p>
                  <p className="text-[10px] text-[#A1A1AA]">Working on Three.js</p>
                </div>
              </div>
              <Circle size={8} fill="#22C55E" className="text-[#22C55E]" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-xs font-bold text-white shrink-0">R</div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] border-2 border-[#0F0F13] rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#E4E4E7]">Riya Patel</p>
                  <p className="text-[10px] text-[#A1A1AA]">Working on UI</p>
                </div>
              </div>
              <Circle size={8} fill="#22C55E" className="text-[#22C55E]" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-xs font-bold text-white shrink-0">K</div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#F59E0B] border-2 border-[#0F0F13] rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#E4E4E7]">Karan Verma</p>
                  <p className="text-[10px] text-[#A1A1AA]">Reviewing Code</p>
                </div>
              </div>
              <Circle size={8} fill="#F59E0B" className="text-[#F59E0B]" />
            </div>

            <div className="flex items-center justify-between bg-[#18181B] p-2 -mx-2 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-xs font-bold text-white shrink-0">{getAvatarInitials(user?.fullName)}</div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] border-2 border-[#18181B] rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#E4E4E7]">You</p>
                  <p className="text-[10px] text-[#A1A1AA]">Online</p>
                </div>
              </div>
              <Circle size={8} fill="#22C55E" className="text-[#22C55E]" />
            </div>

            <p className="text-[10px] text-[#71717A]">+2 more members</p>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="p-6">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-xs font-bold text-[#E4E4E7]">Storage Usage</h2>
            <span className="text-[10px] text-[#A1A1AA]">2.4 GB / 10 GB</span>
          </div>
          <div className="w-full h-1.5 bg-[#27272A] rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00A8FF] to-[#8B5CF6] w-[24%] rounded-full"></div>
          </div>
          <button className="w-full py-2 bg-transparent border border-[#27272A] hover:bg-[#18181B] hover:text-white text-[#A1A1AA] text-xs font-bold rounded-lg transition-colors">
            Manage Storage
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
