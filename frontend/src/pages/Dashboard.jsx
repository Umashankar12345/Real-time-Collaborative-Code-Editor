import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { SettingsContext } from '../contexts/SettingsContext';
import { 
  Home, Users, Settings, LogOut, Search,
  ChevronRight, Plus, Link as LinkIcon, X, Sun, Moon
} from 'lucide-react';
import SettingsModal from '../components/SettingsModal';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { settings, updateSettings } = useContext(SettingsContext);
  const navigate = useNavigate();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateRoom = () => {
    const roomId = `room-${Math.floor(Math.random() * 10000)}`;
    navigate(`/room/${roomId}`);
  };

  const handleJoinRoom = (e) => {
    if (e) e.preventDefault();
    if (joinRoomId.trim()) {
      navigate(`/room/${joinRoomId.trim()}`);
    }
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
      
      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in p-4">
          <div className="bg-[#18181B] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-md shadow-[0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[rgba(255,255,255,0.06)] flex justify-between items-center bg-[#0F0F13]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <LinkIcon size={18} className="text-[#8B5CF6]" />
                Join a Room
              </h2>
              <button onClick={() => setShowJoinModal(false)} className="text-[#71717A] hover:text-white transition-colors bg-[#18181B] p-1.5 rounded-lg hover:bg-[#27272A]">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleJoinRoom} className="p-6">
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#A1A1AA] mb-2 uppercase tracking-wider">Room ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717A]">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    placeholder="e.g. room-1234"
                    className="w-full bg-[#09090B] border border-[rgba(255,255,255,0.1)] text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#8B5CF6] transition-colors placeholder:text-[#52525B]"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-[#71717A] mt-2 font-medium">Enter the exact room ID shared by your collaborator.</p>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!joinRoomId.trim()}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                >
                  Join Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            <div className="flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-[#7F77DD]/20 to-transparent border-l-2 border-[#7F77DD] text-white rounded-r-lg cursor-pointer">
              <Home size={18} className="text-[#7F77DD]" />
              <span className="font-medium text-white">Dashboard</span>
            </div>
          </div>

          <div className="mt-6 mb-2">
            <span className="px-3 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">Workspace</span>
          </div>
          <div className="space-y-1">
            <div onClick={() => setShowJoinModal(true)} className="flex items-center gap-3 px-3 py-2 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <Users size={18} /> <span className="font-medium">Join Room</span>
            </div>
          </div>

          <div className="mt-6 mb-2">
            <span className="px-3 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">Account</span>
          </div>
          <div className="space-y-1">
            <div onClick={() => setShowSettings(true)} className="flex items-center gap-3 px-3 py-2 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <Settings size={18} /> <span className="font-medium">Settings</span>
            </div>
            <div onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-[#71717A] hover:text-[#EF4444] hover:bg-[#18181B] rounded-lg cursor-pointer transition-colors">
              <LogOut size={18} /> <span className="font-medium">Log out</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090B]">
        
        {/* HEADER */}
        <div className="h-16 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-end px-8 bg-[#09090B]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-5 relative">
            <div className="flex items-center gap-4">
              <div 
                onClick={() => updateSettings({ uiTheme: settings.uiTheme === 'dark' ? 'light' : 'dark' })} 
                className="cursor-pointer text-[#71717A] hover:text-white transition-colors no-invert"
                title="Toggle Light/Dark Mode"
              >
                {settings.uiTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="cursor-pointer text-[#71717A] hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
            </div>
            
            <div className="h-8 w-px bg-[rgba(255,255,255,0.06)]"></div>
            
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-white">{user?.fullName || 'Developer'}</span>
                <span className="text-[10px] text-[#71717A] font-medium">{user?.email || 'dev@codecollab.com'}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7F77DD] to-[#378ADD] flex items-center justify-center text-white font-bold border border-[rgba(255,255,255,0.1)] shadow-sm">
                {getAvatarInitials(user?.fullName)}
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* Welcome Section */}
          <div className="bg-[#0F0F13] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 mb-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              Welcome back, {user?.fullName || user?.username}! <span className="animate-bounce inline-block ml-1" style={{ animationDuration: '2s' }}>👋</span>
            </h1>
            <p className="text-[#71717A] font-medium">Create or join a collaborative room to start coding.</p>
          </div>

          {/* Actions */}
          <div>
            <h2 className="text-sm font-bold text-white mb-4">Start Coding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              
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

              <div onClick={() => setShowJoinModal(true)} className="bg-[#0F0F13] border border-[rgba(255,255,255,0.06)] hover:border-[#8B5CF6]/40 p-5 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
                <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LinkIcon size={20} />
                </div>
                <h3 className="font-bold text-white mb-1">Join Room</h3>
                <p className="text-xs text-[#71717A] font-medium mb-4">Join with room ID or invitation link</p>
                <div className="flex justify-end text-[#8B5CF6] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
