import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { X } from 'lucide-react';

const SettingsModal = ({ onClose }) => {
  const { settings, updateSettings } = useContext(SettingsContext);

  const handleChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        width: '500px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-accent)' }}>Settings</h2>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Editor</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>Font Size</span>
              <input 
                type="number" 
                value={settings.fontSize} 
                onChange={e => handleChange('fontSize', parseInt(e.target.value) || 14)}
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', color: 'white', padding: '4px 8px', borderRadius: '4px', width: '80px' }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>Theme</span>
              <select 
                value={settings.theme} 
                onChange={e => handleChange('theme', e.target.value)}
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', color: 'white', padding: '4px 8px', borderRadius: '4px', width: '120px' }}
              >
                <option value="vs-dark">VS Dark</option>
                <option value="github-dark">GitHub Dark</option>
                <option value="dracula">Dracula</option>
                <option value="monokai">Monokai</option>
                <option value="light">Light</option>
                <option value="hc-black">High Contrast</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>Word Wrap</span>
              <select 
                value={settings.wordWrap} 
                onChange={e => handleChange('wordWrap', e.target.value)}
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', color: 'white', padding: '4px 8px', borderRadius: '4px', width: '120px' }}
              >
                <option value="off">Off</option>
                <option value="on">On</option>
                <option value="wordWrapColumn">Word Wrap Column</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>Minimap</span>
              <input 
                type="checkbox" 
                checked={settings.minimap} 
                onChange={e => handleChange('minimap', e.target.checked)}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>Tab Size</span>
              <input 
                type="number" 
                value={settings.tabSize} 
                onChange={e => handleChange('tabSize', parseInt(e.target.value) || 2)}
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', color: 'white', padding: '4px 8px', borderRadius: '4px', width: '80px' }}
              />
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', marginTop: '8px' }}>Collaboration</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>Show Cursors</span>
              <input 
                type="checkbox" 
                checked={settings.showCursors} 
                onChange={e => handleChange('showCursors', e.target.checked)}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>Show User Names</span>
              <input 
                type="checkbox" 
                checked={settings.showUserNames} 
                onChange={e => handleChange('showUserNames', e.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
