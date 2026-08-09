import React, { useState } from 'react';
import { Terminal, AlertCircle, Info, X } from 'lucide-react';

const BottomPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('TERMINAL');

  if (!isOpen) return null;

  return (
    <div style={{
      height: '250px',
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: '16px'
      }}>
        <div style={{ display: 'flex' }}>
          {['TERMINAL', 'OUTPUT', 'PROBLEMS'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '1px',
                color: activeTab === tab ? 'var(--text-accent)' : 'var(--text-secondary)',
                borderBottom: activeTab === tab ? '2px solid var(--accent-color)' : '2px solid transparent'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
        {activeTab === 'TERMINAL' && (
          <div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontStyle: 'italic' }}>
              Terminal execution is currently disabled for security reasons in this environment. 
              Only UI is provided as requested.
            </div>
            <div>$ <span style={{ color: 'var(--text-secondary)' }}>echo "Terminal not connected to backend container"</span></div>
            <div>Terminal not connected to backend container</div>
            <div>$ <span className="cursor-blink" style={{ display: 'inline-block', width: '8px', height: '14px', backgroundColor: 'var(--text-primary)', verticalAlign: 'middle' }}></span></div>
          </div>
        )}
        
        {activeTab === 'OUTPUT' && (
          <div style={{ color: 'var(--text-secondary)' }}>
            [CodeCollab IDE] Ready. Output channel initialized.
          </div>
        )}

        {activeTab === 'PROBLEMS' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              No problems have been detected in the workspace.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomPanel;
