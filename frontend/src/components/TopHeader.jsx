import React, { useState } from 'react';
import { LogOut, Users, CheckCircle, XCircle, Loader2, Settings, UserPlus } from 'lucide-react';

const TopHeader = ({ roomId, connectionStatus, collaborators, username, onLogout, onOpenSettings }) => {
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);

  const getStatusIcon = () => {
    switch(connectionStatus) {
      case 'Connected': return <CheckCircle size={14} color="var(--success-color)" />;
      case 'Disconnected': return <XCircle size={14} color="var(--error-color)" />;
      default: return <Loader2 size={14} color="var(--warning-color)" className="animate-spin" />;
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
      color: 'var(--text-primary)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--text-accent)' }}>
          CodeCollab IDE
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Room: {roomId}</span>
          <button 
            onClick={copyRoomId}
            style={{ padding: '2px 8px', backgroundColor: 'var(--bg-hover)', borderRadius: '4px', border: '1px solid var(--border-light)' }}
          >
            [🔗 Copy]
          </button>
          <button 
            onClick={() => alert(`Invite Link: http://localhost:5173/room/${roomId}`)}
            style={{ padding: '2px 8px', backgroundColor: 'var(--accent-color)', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <UserPlus size={12} /> Invite
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginLeft: '10px' }}>
          {getStatusIcon()}
          <span style={{ color: connectionStatus === 'Disconnected' ? 'var(--error-color)' : 'inherit' }}>
            {connectionStatus}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', cursor: 'pointer' }}
          onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
        >
          <Users size={16} color="var(--text-secondary)" />
          <div style={{ display: 'flex', gap: '4px' }}>
            {collaborators.slice(0, 3).map(c => (
              <div 
                key={c.username}
                title={c.username}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  backgroundColor: c.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 'bold', color: 'white',
                  border: '2px solid var(--bg-secondary)'
                }}
              >
                {c.username.substring(0, 2).toUpperCase()}
              </div>
            ))}
            {collaborators.length > 3 && (
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                backgroundColor: 'var(--bg-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)',
                border: '2px solid var(--bg-secondary)'
              }}>
                +{collaborators.length - 3}
              </div>
            )}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {collaborators.length}
          </span>

          {showAvatarDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '10px',
              width: '200px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '8px 0',
              zIndex: 100,
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
              <div style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-light)', marginBottom: '4px' }}>
                ONLINE USERS
              </div>
              {collaborators.map(c => (
                <div key={c.username} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '13px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success-color)' }}></div>
                  <span style={{ color: 'var(--text-primary)' }}>{c.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ borderLeft: '1px solid var(--border-color)', height: '20px' }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={onOpenSettings}
            style={{ color: 'var(--text-secondary)', padding: '4px', borderRadius: '4px' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Settings"
          >
            <Settings size={16} />
          </button>

          <span style={{ fontSize: '13px', marginLeft: '4px' }}>{username}</span>
          
          <button 
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;

