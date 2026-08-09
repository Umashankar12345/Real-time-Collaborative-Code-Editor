import React, { useState } from 'react';
import axios from 'axios';
import { File, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const FileExplorer = ({ roomId, token, files, setFiles, activeFileId, setActiveFileId, socket }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/rooms/${roomId}/files`, 
        { name: newFileName, language: 'javascript' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFiles(prev => [...prev, res.data]);
      setIsCreating(false);
      setNewFileName('');
      setActiveFileId(res.data.id);
      
      socket?.emit('file:create', { roomId, file: res.data });
    } catch (error) {
      console.error('Error creating file', error);
    }
  };

  const handleDeleteFile = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${roomId}/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(prev => prev.filter(f => f.id !== id));
      if (activeFileId === id) setActiveFileId(null);
      
      socket?.emit('file:delete', { roomId, fileId: id });
    } catch (error) {
      console.error('Error deleting file', error);
    }
  };

  const handleRenameFile = async (e, id) => {
    e.stopPropagation();
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/rooms/${roomId}/files/${id}/rename`,
        { name: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFiles(prev => prev.map(f => f.id === id ? { ...f, name: editName } : f));
      setEditingId(null);
      
      socket?.emit('file:rename', { roomId, fileId: id, name: editName });
    } catch (error) {
      console.error('Error renaming file', error);
    }
  };

  return (
    <div style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--text-secondary)' }}>
          EXPLORER
        </span>
        <button 
          onClick={() => setIsCreating(true)}
          style={{ padding: '4px', borderRadius: '4px' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="New File"
        >
          <Plus size={16} color="var(--text-primary)" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {isCreating && (
          <div style={{ padding: '4px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <File size={16} color="var(--text-secondary)" />
            <input 
              autoFocus
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFile();
                if (e.key === 'Escape') setIsCreating(false);
              }}
              onBlur={() => setIsCreating(false)}
              style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--accent-color)', color: 'white', padding: '2px 4px', fontSize: '14px', outline: 'none' }}
            />
          </div>
        )}
        
        {files.map(file => (
          <div 
            key={file.id}
            onClick={() => setActiveFileId(file.id)}
            style={{ 
              padding: '6px 16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              backgroundColor: activeFileId === file.id ? 'var(--bg-hover)' : 'transparent',
              color: activeFileId === file.id ? 'var(--text-accent)' : 'var(--text-primary)'
            }}
            onMouseOver={(e) => {
              if (activeFileId !== file.id) e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
              e.currentTarget.querySelector('.file-actions').style.display = 'flex';
            }}
            onMouseOut={(e) => {
              if (activeFileId !== file.id) e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.querySelector('.file-actions').style.display = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <File size={16} color="var(--text-secondary)" />
              {editingId === file.id ? (
                <input 
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameFile(e, file.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onBlur={(e) => handleRenameFile(e, file.id)}
                  style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--accent-color)', color: 'white', padding: '2px 4px', fontSize: '14px', outline: 'none' }}
                />
              ) : (
                <span style={{ fontSize: '14px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {file.name}
                </span>
              )}
            </div>
            
            {editingId !== file.id && (
              <div className="file-actions" style={{ display: 'none', gap: '4px' }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); setEditingId(file.id); setEditName(file.name); }}
                  style={{ padding: '2px', color: 'var(--text-secondary)' }}
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={(e) => handleDeleteFile(e, file.id)}
                  style={{ padding: '2px', color: 'var(--text-secondary)' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
        {files.length === 0 && !isCreating && (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
            No files. Create one!
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
