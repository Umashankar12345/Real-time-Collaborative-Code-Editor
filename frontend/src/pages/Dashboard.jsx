import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  Home, FolderKanban, Users, Mail, Folder, Star, LayoutTemplate, 
  User, Settings, CreditCard, LogOut, Search, Bell, HelpCircle, 
  ChevronRight, Plus, Link, FilePlus, Download, MoreHorizontal,
  Circle, Box as BoxIcon, Globe, Code, Play, Sun, Moon, Github
} from 'lucide-react';
import SettingsModal from '../components/SettingsModal';
import { SettingsContext } from '../contexts/SettingsContext';

const AnimatedNodeGraph = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* Abstract particle/glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#7F77DD]/20 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#378ADD]/20 rounded-full blur-2xl mix-blend-screen animate-pulse delay-700"></div>
      
      {/* Node Graph structure */}
      <div className="relative z-10 w-48 h-32 flex items-center justify-center">
        {/* Lines */}
        <div className="absolute top-1/2 left-1/2 w-28 h-px bg-gradient-to-r from-transparent via-[#7F77DD] to-transparent -rotate-45 transform -translate-x-1/2 -translate-y-1/2 opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-px bg-gradient-to-r from-transparent via-[#378ADD] to-transparent rotate-12 transform -translate-x-1/2 -translate-y-1/2 opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[#7F77DD] to-transparent -rotate-[60deg] transform -translate-x-1/2 -translate-y-1/2 opacity-40"></div>

        {/* Nodes */}
        <div className="absolute top-[10%] left-[10%] w-3 h-3 bg-[#378ADD] rounded-full shadow-[0_0_10px_#378ADD] animate-[float_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[10%] left-[20%] w-2 h-2 bg-[#7F77DD] rounded-full shadow-[0_0_10px_#7F77DD] animate-[float_5s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-[20%] right-[10%] w-4 h-4 bg-gradient-to-br from-[#7F77DD] to-[#378ADD] rounded-full shadow-[0_0_15px_#7F77DD] animate-[float_6s_ease-in-out_infinite_1s] flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
        <div className="absolute bottom-[20%] right-[20%] w-2.5 h-2.5 bg-[#378ADD] rounded-full shadow-[0_0_8px_#378ADD] animate-[float_4.5s_ease-in-out_infinite_0.5s]"></div>
        
        {/* Central Hub */}
        <div className="relative w-14 h-14 bg-[#18181B] border border-[rgba(255,255,255,0.06)] rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(127,119,221,0.15)] z-20">
          <Code size={24} className="text-[#7F77DD]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { settings, updateSettings } = useContext(SettingsContext);
  const navigate = useNavigate();
  const [storageFill, setStorageFill] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Animate storage bar on mount
    const timer = setTimeout(() => {
      setStorageFill(24);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      
      {/* SIDEBAR */}
      <div className="w-[260px] bg-[#0F0F13] border-r border-[rgba(255,255,255,0.06)] flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-[rgba(255,255,255,0.06)]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7F77DD] to-[#378ADD] flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(127,119,221,0.3)]">
            &lt;/&gt;
          </div>
          <span className="font-bold text-white text-lg tracking-wide">CodeCollab</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <div className="mb-2">
            {/* Active item using hero gradient */}
            <div className="flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-[#7F77DD]/20 to-transparent border-l-2 border-[#7F77DD] text-white rounded-r-lg cursor-pointer">
              <Home size={18} className="text-[#7F77DD]" />
              <span className="font-medium text-white">Dashboard</span>
            </div>
          </div>

          <div className="mt-6 mb-2">
            <span className="px-3 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">Workspace</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <FolderKanban size={18} /> <span className="font-medium">My Rooms</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <Users size={18} /> <span className="font-medium">Join Room</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Mail size={18} /> <span className="font-medium">Invitations</span>
              </div>
              <span className="bg-[#18181B] border border-[rgba(255,255,255,0.06)] text-xs px-2 py-0.5 rounded-full text-white font-medium">2</span>
            </div>
          </div>

          <div className="mt-6 mb-2">
            <span className="px-3 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">Projects</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <Folder size={18} /> <span className="font-medium">My Projects</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <Star size={18} /> <span className="font-medium">Starred</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <LayoutTemplate size={18} /> <span className="font-medium">Templates</span>
            </div>
          </div>

          <div className="mt-6 mb-2">
            <span className="px-3 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">Account</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <User size={18} /> <span className="font-medium">Profile</span>
            </div>
            <div onClick={() => setShowSettings(true)} className="flex items-center gap-3 px-3 py-2 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <Settings size={18} /> <span className="font-medium">Settings</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <CreditCard size={18} /> <span className="font-medium">Billing</span>
            </div>
            <div onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-[#71717A] hover:text-[#EF4444] hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <LogOut size={18} /> <span className="font-medium">Log out</span>
            </div>
          </div>
        </div>

        <div className="p-4 m-4 bg-[#18181B] border border-[rgba(255,255,255,0.06)] rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7F77DD]/10 rounded-full mix-blend-screen filter blur-2xl -mr-10 -mt-10 group-hover:bg-[#7F77DD]/20 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-white font-bold">
              <span className="text-[#F59E0B]">👑</span> Upgrade to Pro
            </div>
            <p className="text-xs text-[#71717A] mb-4 leading-relaxed font-medium">
              Unlock unlimited rooms, advanced collaboration and more.
            </p>
            <button className="w-full py-2 bg-gradient-to-r from-[#7F77DD] to-[#378ADD] hover:opacity-90 text-white text-xs font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(127,119,221,0.25)]">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090B]">
        
        {/* HEADER */}
        <div className="h-16 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between px-8 bg-[#09090B]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#18181B] border border-[rgba(255,255,255,0.06)] rounded-full px-4 py-1.5 text-sm text-[#71717A] focus-within:border-[rgba(255,255,255,0.2)] transition-colors">
              <Search size={16} />
              <input type="text" placeholder="Search rooms, projects..." className="bg-transparent border-none outline-none w-48 text-white placeholder-[#71717A] font-medium" />
            </div>
          </div>
          
          <div className="flex items-center gap-5 relative">
            <div className="flex items-center gap-4">
              <div 
                onClick={() => updateSettings({ uiTheme: settings.uiTheme === 'dark' ? 'light' : 'dark' })} 
                className="cursor-pointer text-[#71717A] hover:text-white transition-colors no-invert"
                title="Toggle Light/Dark Mode"
              >
                {settings.uiTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <div 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative cursor-pointer text-[#71717A] hover:text-white transition-colors"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#7F77DD] text-[9px] text-white font-bold flex items-center justify-center rounded-full border-2 border-[#09090B] animate-pulse">3</span>
              </div>
              <div className="cursor-pointer text-[#71717A] hover:text-white transition-colors">
                <HelpCircle size={20} />
              </div>
              <a href="https://github.com/Umashankar12345/Real-time-Collaborative-Code-Editor" target="_blank" rel="noreferrer" className="cursor-pointer text-[#71717A] hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
            
            {showNotifications && (
              <div className="absolute top-12 right-0 w-80 bg-[#18181B] border border-[rgba(255,255,255,0.06)] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-fade-in no-invert">
                <div className="p-4 border-b border-[rgba(255,255,255,0.06)] flex justify-between items-center bg-[#0F0F13]">
                  <h3 className="font-bold text-white text-sm">Notifications</h3>
                  <span className="text-xs text-[#7F77DD] cursor-pointer hover:text-white transition-colors">Mark all as read</span>
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {/* Notification Item 1 */}
                  <div className="p-4 border-b border-[rgba(255,255,255,0.02)] hover:bg-[#27272A] transition-colors cursor-pointer flex gap-3 relative">
                    <div className="w-2 h-2 bg-[#7F77DD] rounded-full mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-sm text-white mb-1"><span className="font-bold">Aman Sharma</span> invited you to <span className="font-bold text-[#7F77DD]">React Auth Module</span></p>
                      <p className="text-xs text-[#71717A]">10 minutes ago</p>
                    </div>
                  </div>
                  {/* Notification Item 2 */}
                  <div className="p-4 border-b border-[rgba(255,255,255,0.02)] hover:bg-[#27272A] transition-colors cursor-pointer flex gap-3">
                    <div className="w-2 h-2 bg-[#F59E0B] rounded-full mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-sm text-white mb-1"><span className="font-bold">Storage Alert</span></p>
                      <p className="text-xs text-[#71717A] mb-1">Your storage is 80% full. Upgrade to Pro for unlimited storage.</p>
                      <p className="text-[10px] text-[#71717A]">2 hours ago</p>
                    </div>
                  </div>
                  {/* Notification Item 3 */}
                  <div className="p-4 hover:bg-[#27272A] transition-colors cursor-pointer flex gap-3 opacity-60">
                    <div className="w-2 h-2 bg-transparent rounded-full mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-sm text-white mb-1">Welcome to <span className="font-bold">CodeCollab</span>!</p>
                      <p className="text-xs text-[#71717A] mb-1">Get started by creating your first room or joining an existing one.</p>
                      <p className="text-[10px] text-[#71717A]">1 day ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-[#0F0F13] text-center text-xs text-[#71717A] cursor-pointer hover:text-white transition-colors border-t border-[rgba(255,255,255,0.06)]">
                  View all notifications
                </div>
              </div>
            )}
            
            <div className="h-8 w-px bg-[rgba(255,255,255,0.06)]"></div>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-white group-hover:text-[#7F77DD] transition-colors">{user?.fullName || 'Developer'}</span>
                <span className="text-[10px] text-[#71717A] font-medium">{user?.email || 'dev@codecollab.com'}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7F77DD] to-[#378ADD] flex items-center justify-center text-white font-bold border border-[rgba(255,255,255,0.1)] shadow-sm">
                {getAvatarInitials(user?.fullName)}
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          
          {/* Welcome Section */}
          <div className="bg-[#0F0F13] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 mb-8 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7F77DD]/5 rounded-full filter blur-3xl mix-blend-screen pointer-events-none"></div>
            
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                Welcome back, {user?.fullName || user?.username}! <span className="animate-bounce inline-block ml-1" style={{ animationDuration: '2s' }}>👋</span>
              </h1>
              <p className="text-[#71717A] font-medium">Let's build something amazing together.</p>
            </div>
            
            <div className="w-[300px] h-[150px] relative z-10 opacity-90">
               <AnimatedNodeGraph />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-10">
            <h2 className="text-sm font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div onClick={handleCreateRoom} className="bg-[#0F0F13] border border-[rgba(255,255,255,0.06)] hover:border-[#7F77DD]/40 p-5 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7F77DD] to-[#378ADD] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(127,119,221,0.25)]">
                  <Plus size={20} />
                </div>
                <h3 className="font-bold text-white mb-1">Create Room</h3>
                <p className="text-xs text-[#71717A] font-medium mb-4">Start a new collaborative session</p>
                <div className="flex justify-end text-[#7F77DD] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>

              <div className="bg-[#0F0F13] border border-[rgba(255,255,255,0.06)] hover:border-[#8B5CF6]/40 p-5 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
                <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Link size={20} />
                </div>
                <h3 className="font-bold text-white mb-1">Join Room</h3>
                <p className="text-xs text-[#71717A] font-medium mb-4">Join with room ID or invitation link</p>
                <div className="flex justify-end text-[#8B5CF6] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>

              <div className="bg-[#0F0F13] border border-[rgba(255,255,255,0.06)] hover:border-[#10B981]/40 p-5 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
                <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FilePlus size={20} />
                </div>
                <h3 className="font-bold text-white mb-1">New Project</h3>
                <p className="text-xs text-[#71717A] font-medium mb-4">Create a new project from scratch</p>
                <div className="flex justify-end text-[#10B981] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>

              <div className="bg-[#0F0F13] border border-[rgba(255,255,255,0.06)] hover:border-[#F59E0B]/40 p-5 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Download size={20} />
                </div>
                <h3 className="font-bold text-white mb-1">Import Project</h3>
                <p className="text-xs text-[#71717A] font-medium mb-4">Import from GitHub or your device</p>
                <div className="flex justify-end text-[#F59E0B] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>

            </div>
          </div>

          {/* Recent Rooms */}
          <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-sm font-bold text-white">Recent Rooms</h2>
              <span className="text-xs text-[#7F77DD] hover:text-white cursor-pointer font-bold flex items-center gap-1 transition-colors">View all <ChevronRight size={12} /></span>
            </div>
            
            <div className="bg-[#0F0F13] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)] text-[10px] text-[#71717A] font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 font-bold">Room Name</th>
                    <th className="py-4 px-6 font-bold">Last Activity</th>
                    <th className="py-4 px-6 font-bold">Members</th>
                    <th className="py-4 px-6 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { id: 'default-room-913', name: 'Frontend Refactor', desc: 'You created this room', time: '2 min ago', active: true, color: 'border-[#7F77DD]' },
                    { id: 'auth-module-setup', name: 'React Auth Module', desc: 'Aman Sharma', time: '1 hour ago', active: false, color: 'border-[#378ADD]' },
                    { id: 'payment-api', name: 'Payment API Integration', desc: 'Riya Patel', time: '3 hours ago', active: false, color: 'border-[#10B981]' }
                  ].map((room, i) => (
                    <tr key={room.id} className="border-b border-[rgba(255,255,255,0.02)] hover:bg-[#18181B] transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          {/* Live Canvas / Code Thumbnail */}
                          <div className={`w-12 h-10 rounded-md bg-[#09090B] border border-[rgba(255,255,255,0.06)] border-l-2 ${room.color} flex flex-col justify-center p-1.5 gap-1 shadow-sm`}>
                             <div className="w-3/4 h-0.5 bg-[#27272A] rounded-full"></div>
                             <div className="w-1/2 h-0.5 bg-[rgba(255,255,255,0.1)] rounded-full"></div>
                             <div className="w-full h-0.5 bg-[#27272A] rounded-full"></div>
                          </div>
                          <div>
                            <div className="font-bold text-white mb-0.5">{room.name}</div>
                            <div className="text-xs text-[#71717A] font-medium">{room.desc}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#71717A] text-xs font-medium">
                        <div className="flex items-center gap-2">
                          {room.active && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>}
                          <span className={room.active ? 'text-[#10B981]' : ''}>{room.time}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex -space-x-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1E293B] to-[#334155] border-2 border-[#0F0F13] flex items-center justify-center text-[10px] font-bold text-white">U</div>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369A1] border-2 border-[#0F0F13] flex items-center justify-center text-[10px] font-bold text-white">A</div>
                          <div className="w-7 h-7 rounded-full bg-[#18181B] border-2 border-[#0F0F13] flex items-center justify-center text-[10px] text-[#A1A1AA] font-medium">+2</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => navigate(`/room/${room.id}`)} className="px-3 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-white border border-[rgba(255,255,255,0.06)] rounded-md text-xs font-bold transition-all flex items-center gap-1.5">
                            <Play size={10} className="text-[#7F77DD]" /> Open
                          </button>
                          <button className="p-1.5 text-[#71717A] hover:text-white transition-colors rounded-md hover:bg-[#18181B]">
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
              <span className="text-xs text-[#7F77DD] hover:text-white cursor-pointer font-bold flex items-center gap-1 transition-colors">View all <ChevronRight size={12} /></span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0F0F13] border border-[rgba(255,255,255,0.06)] hover:border-[#10B981]/30 p-4 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
                    <BoxIcon size={20} />
                  </div>
                  <span className="text-[10px] font-bold bg-[#18181B] border border-[rgba(255,255,255,0.06)] px-2 py-0.5 rounded text-[#10B981]">3D</span>
                </div>
                <h3 className="font-bold text-white mb-1 group-hover:text-[#10B981] transition-colors">Three.js Starter</h3>
                <p className="text-xs text-[#71717A] font-medium">Basic Three.js scene with lights and camera</p>
              </div>

              <div className="bg-[#0F0F13] border border-[rgba(255,255,255,0.06)] hover:border-[#8B5CF6]/30 p-4 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                    <Globe size={20} />
                  </div>
                  <span className="text-[10px] font-bold bg-[#18181B] border border-[rgba(255,255,255,0.06)] px-2 py-0.5 rounded text-[#8B5CF6]">3D</span>
                </div>
                <h3 className="font-bold text-white mb-1 group-hover:text-[#8B5CF6] transition-colors">WebGL Starter</h3>
                <p className="text-xs text-[#71717A] font-medium">WebGL project setup with modern tools</p>
              </div>

              <div className="bg-[#0F0F13] border border-[rgba(255,255,255,0.06)] hover:border-[#378ADD]/30 p-4 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#378ADD]/10 text-[#378ADD] flex items-center justify-center font-bold text-lg">
                    ⚛
                  </div>
                  <span className="text-[10px] font-bold bg-[#18181B] border border-[rgba(255,255,255,0.06)] px-2 py-0.5 rounded text-[#378ADD]">UI</span>
                </div>
                <h3 className="font-bold text-white mb-1 group-hover:text-[#378ADD] transition-colors">React + Vite</h3>
                <p className="text-xs text-[#71717A] font-medium">Modern React boilerplate</p>
              </div>

              <div className="bg-[#0F0F13] border border-[rgba(255,255,255,0.06)] hover:border-[#F59E0B]/30 p-4 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
                    JS
                  </div>
                  <span className="text-[10px] font-bold bg-[#18181B] border border-[rgba(255,255,255,0.06)] px-2 py-0.5 rounded text-[#F59E0B]">JS</span>
                </div>
                <h3 className="font-bold text-white mb-1 group-hover:text-[#F59E0B] transition-colors">Vanilla JS Starter</h3>
                <p className="text-xs text-[#71717A] font-medium">Clean JavaScript project template</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-[280px] bg-[#0F0F13] border-l border-[rgba(255,255,255,0.06)] flex flex-col shrink-0">


        {/* Storage Usage */}
        <div className="p-6">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-xs font-bold text-white">Storage Usage</h2>
            <span className="text-[10px] text-[#71717A] font-medium">2.4 GB / 10 GB</span>
          </div>
          <div className="w-full h-1.5 bg-[#18181B] border border-[rgba(255,255,255,0.06)] rounded-full mb-4 overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#7F77DD] to-[#378ADD] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(127,119,221,0.5)]" 
              style={{ width: `${storageFill}%` }}
            ></div>
          </div>
          <button className="w-full py-2 bg-transparent border border-[rgba(255,255,255,0.06)] hover:bg-[#18181B] hover:border-[rgba(255,255,255,0.1)] text-white text-xs font-bold rounded-lg transition-colors">
            Manage Storage
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
