import React from 'react';
import { GitBranch, RefreshCw, Check, Bell, Code, Layout } from 'lucide-react';

const StatusBar = ({ connectionStatus }) => {
  return (
    <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] font-sans z-50 select-none shadow-[0_-1px_0_rgba(255,255,255,0.1)] overflow-hidden shrink-0">
      <div className="flex items-center h-full gap-4">
        <div className="flex items-center gap-1.5 hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
          <GitBranch size={12} />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1.5 hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
          <RefreshCw size={12} className={connectionStatus === 'Connecting' ? 'animate-spin' : ''} />
        </div>
        <div className="flex items-center gap-1.5 hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
          {connectionStatus === 'Connected' ? (
             <><Check size={12} /><span>Connected</span></>
          ) : (
             <span>{connectionStatus}</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center h-full gap-3">
        <div className="flex items-center hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
          Ln 1, Col 1
        </div>
        <div className="flex items-center hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
          Spaces: 2
        </div>
        <div className="flex items-center hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
          UTF-8
        </div>
        <div className="flex items-center hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
          LF
        </div>
        <div className="flex items-center gap-1.5 hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
          <Code size={12} />
          <span>JavaScript</span>
        </div>
        <div className="flex items-center hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
          <Layout size={12} />
        </div>
        <div className="flex items-center hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
          <Bell size={12} />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
