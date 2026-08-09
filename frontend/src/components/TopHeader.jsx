import React from 'react';
import { LogOut, Users, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const TopHeader = ({ roomId, connectionStatus, collaborators, username, onLogout }) => {
  const getStatusIcon = () => {
    switch(connectionStatus) {
      case 'Connected': return <CheckCircle size={16} color="var(--success-color)" />;
      case 'Disconnected': return <XCircle size={16} color="var(--error-color)" />;
      default: return <Loader2 size={16} color="var(--warning-color)" className="animate-spin" />;
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard!');
  };

  return (
    <div style={{
      height: 'var(--header-height)',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      color: 'var(--text-primary)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--text-accent)' }}>
          CodeCollab IDE
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Room:</span>
          <button 
            onClick={copyRoomId}
            style={{ padding: '2px 8px', backgroundColor: 'var(--bg-hover)', borderRadius: '4px', border: '1px solid var(--border-light)' }}
          >
            {roomId} [Copy]
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', marginLeft: '10px' }}>
          {getStatusIcon()}
          <span>{connectionStatus}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users size={18} color="var(--text-secondary)" />
          <div style={{ display: 'flex', gap: '4px' }}>
            {collaborators.map(c => (
              <div 
                key={c.username}
                title={c.username}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  backgroundColor: c.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 'bold', color: 'white',
                  border: '2px solid var(--bg-secondary)'
                }}
              >
                {c.username.substring(0, 2).toUpperCase()}
              </div>
            ))}
          </div>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {collaborators.length} Online
          </span>
        </div>
        
        <div style={{ borderLeft: '1px solid var(--border-color)', height: '24px' }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px' }}>{username}</span>
          <button 
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
