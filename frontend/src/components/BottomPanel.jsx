import React, { useState } from 'react';
import { Terminal, AlertCircle, Info, X } from 'lucide-react';

const BottomPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('TERMINAL');

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] w-full text-[#cccccc]">
      <div className="flex items-center justify-between pr-4 border-b border-[#3b3b3b] bg-[#1e1e1e] shrink-0">
        <div className="flex">
          {['TERMINAL', 'OUTPUT', 'PROBLEMS'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[11px] font-medium tracking-wide transition-none border-b-2 ${
                activeTab === tab 
                  ? 'text-white border-[#007acc]' 
                  : 'text-[#969696] border-transparent hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button 
          onClick={onClose} 
          className="text-[#969696] hover:text-white hover:bg-[#333333] p-1 rounded-sm transition-colors"
          title="Close Panel"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto text-[13px] font-mono">
        {activeTab === 'TERMINAL' && (
          <div className="flex flex-col gap-1">
            <div className="text-[#969696] mb-2 bg-[#252526] p-2 border border-[#3b3b3b]">
              Terminal execution is currently disabled in this environment.
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#89d185]">~/project</span>
              <span className="text-[#007acc]">$</span>
              <span className="text-[#cccccc]">echo "Terminal not connected to backend container"</span>
            </div>
            <div className="text-[#cccccc]">Terminal not connected to backend container</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#89d185]">~/project</span>
              <span className="text-[#007acc]">$</span>
              <span className="animate-pulse w-2 h-4 bg-[#cccccc]"></span>
            </div>
          </div>
        )}
        
        {activeTab === 'OUTPUT' && (
          <div className="text-[#969696]">
            [CodeCollab IDE] Ready. Output channel initialized.
          </div>
        )}

        {activeTab === 'PROBLEMS' && (
          <div>
            <div className="flex items-center gap-2 text-[#89d185]">
              <Info size={14} />
              No problems have been detected in the workspace.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomPanel;
