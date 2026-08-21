import React, { useState } from 'react';
import { LogOut, Users, CheckCircle, XCircle, Loader2, Settings, UserPlus } from 'lucide-react';

const TopHeader = ({ roomId, connectionStatus, collaborators, username, onLogout, onOpenSettings }) => {
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);

  const getStatusIcon = () => {
    switch(connectionStatus) {
      case 'Connected': return <CheckCircle size={16} className="text-[var(--success-color)]" />;
      case 'Disconnected': return <XCircle size={16} className="text-[var(--error-color)]" />;
      default: return <Loader2 size={16} className="text-[var(--warning-color)] animate-spin" />;
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard!');
  };

  return (
    <div className="h-[var(--header-height)] bg-[var(--bg-secondary)] backdrop-blur-md border-b border-[var(--border-color)] flex items-center justify-between px-6 text-[var(--text-primary)] relative z-20 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center gap-2 tracking-tight">
          <span className="bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-md">&lt;/&gt;</span>
          CodeCollab
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[var(--text-secondary)] font-medium bg-black/20 px-3 py-1 rounded-md border border-[var(--border-light)]">Room: {roomId}</span>
          <button 
            onClick={copyRoomId}
            className="px-3 py-1 bg-[var(--bg-hover)] hover:bg-white/10 rounded-md border border-[var(--border-light)] transition-colors text-xs font-semibold"
          >
            Copy ID
          </button>
          <button 
            onClick={() => window.open('https://github.com', '_blank')}
            className="px-3 py-1 bg-[#24292e] hover:bg-[#2f363d] text-white rounded-md flex items-center gap-1.5 transition-all shadow-sm text-xs font-semibold border border-white/10"
          >
            GitHub
          </button>
          <button 
            onClick={() => alert(`Invite Link: http://localhost:5173/room/${roomId}`)}
            className="px-3 py-1 bg-gradient-to-r from-[var(--accent-color)] to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-md flex items-center gap-1.5 transition-all shadow-sm text-xs font-semibold"
          >
            <UserPlus size={14} /> Invite
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-sm ml-4 font-medium bg-black/20 px-3 py-1 rounded-full border border-[var(--border-light)]">
          {getStatusIcon()}
          <span className={connectionStatus === 'Disconnected' ? 'text-[var(--error-color)]' : 'text-gray-300'}>
            {connectionStatus}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div 
          className="flex items-center gap-2.5 relative cursor-pointer hover:bg-[var(--bg-hover)] p-2 rounded-lg transition-colors"
          onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
        >
          <Users size={18} className="text-[var(--text-secondary)]" />
          <div className="flex -space-x-2">
            {collaborators.slice(0, 3).map((c, i) => (
              <div 
                key={c.username}
                title={c.username}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-[2px] border-[var(--bg-secondary)] shadow-sm z-10 hover:z-20 transition-transform hover:scale-110"
                style={{ backgroundColor: c.color || `hsl(${i * 60}, 70%, 50%)` }}
              >
                {c.username.substring(0, 2).toUpperCase()}
              </div>
            ))}
            {collaborators.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)] border-[2px] border-[var(--bg-secondary)] z-0">
                +{collaborators.length - 3}
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-[var(--text-secondary)] bg-black/30 px-2 py-0.5 rounded-md">
            {collaborators.length}
          </span>

          {showAvatarDropdown && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-light)] rounded-xl py-2 z-[100] shadow-xl animate-fade-in">
              <div className="px-4 py-1 text-[10px] font-bold text-[var(--text-secondary)] border-b border-[var(--border-light)] mb-1 tracking-wider">
                ONLINE COLLABORATORS
              </div>
              <div className="max-h-48 overflow-y-auto">
                {collaborators.map(c => (
                  <div key={c.username} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: c.color || '#3b82f6' }}>
                        {c.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[var(--success-color)] border border-[var(--bg-secondary)]"></div>
                    </div>
                    <span className="text-sm text-[var(--text-primary)] font-medium truncate">{c.username}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="h-6 w-px bg-[var(--border-light)]"></div>
        
        <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-[var(--border-light)]">
          <span className="text-sm font-medium px-3 text-gray-300">{username}</span>
          
          <button 
            onClick={onOpenSettings}
            className="text-[var(--text-secondary)] hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
            title="Settings"
          >
            <Settings size={18} />
          </button>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--error-color)] p-1.5 rounded-md hover:bg-[var(--error-color)]/10 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;

