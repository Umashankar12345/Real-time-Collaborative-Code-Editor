import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { File, Plus, Trash2, Edit2, FolderPlus, FileText, Download } from 'lucide-react';

const FileExplorer = ({ roomId, token, files, setFiles, activeFileId, onOpenFile, socket }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

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
      onOpenFile(res.data.id);
      
      socket?.emit('file:create', { roomId, file: res.data });
    } catch (error) {
      console.error('Error creating file', error);
    }
  };

  const handleDeleteFile = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${roomId}/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(prev => prev.filter(f => f.id !== id));
      
      socket?.emit('file:delete', { roomId, fileId: id });
    } catch (error) {
      console.error('Error deleting file', error);
    }
  };

  const handleRenameFile = async (id) => {
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

  const downloadFile = (file) => {
    const blob = new Blob([file.content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleContextMenu = (e, file) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      file
    });
  };

  return (
    <div 
      style={{
        width: '250px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
      onContextMenu={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          setContextMenu({ x: e.pageX, y: e.pageY, file: null });
        }
      }}
    >
      <div style={{ 
        padding: '12px 16px', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--text-secondary)' }}>
          EXPLORER
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            onClick={() => setIsCreating(true)}
            style={{ padding: '4px', borderRadius: '4px', color: 'var(--text-secondary)' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="New File"
          >
            <FileText size={14} />
          </button>
          <button 
            onClick={() => alert('Folder support coming soon')}
            style={{ padding: '4px', borderRadius: '4px', color: 'var(--text-secondary)' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="New Folder"
          >
            <FolderPlus size={14} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
        {isCreating && (
          <div style={{ padding: '4px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <File size={14} color="var(--text-secondary)" />
            <input 
              autoFocus
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFile();
                if (e.key === 'Escape') setIsCreating(false);
              }}
              onBlur={() => setIsCreating(false)}
              style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--accent-color)', color: 'white', padding: '2px 4px', fontSize: '13px', outline: 'none' }}
            />
          </div>
        )}
        
        {files.map(file => (
          <div 
            key={file.id}
            onClick={() => onOpenFile(file.id)}
            onContextMenu={(e) => handleContextMenu(e, file)}
            style={{ 
              padding: '4px 16px', 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              backgroundColor: activeFileId === file.id ? 'var(--bg-hover)' : 'transparent',
              color: activeFileId === file.id ? 'var(--text-accent)' : 'var(--text-primary)',
              fontSize: '13px'
            }}
            onMouseOver={(e) => {
              if (activeFileId !== file.id) e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
            }}
            onMouseOut={(e) => {
              if (activeFileId !== file.id) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <File size={14} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
            {editingId === file.id ? (
              <input 
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.stopPropagation(); handleRenameFile(file.id); }
                  if (e.key === 'Escape') { e.stopPropagation(); setEditingId(null); }
                }}
                onBlur={() => handleRenameFile(file.id)}
                style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--accent-color)', color: 'white', padding: '0px 4px', fontSize: '13px', outline: 'none' }}
              />
            ) : (
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {file.name}
              </span>
            )}
          </div>
        ))}
      </div>

      {contextMenu && (
        <div style={{
          position: 'fixed',
          top: contextMenu.y,
          left: contextMenu.x,
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          padding: '4px 0',
          zIndex: 1000,
          minWidth: '150px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          fontSize: '13px'
        }}>
          {contextMenu.file ? (
            <>
              <div 
                className="context-menu-item"
                style={{ padding: '6px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => { setEditingId(contextMenu.file.id); setEditName(contextMenu.file.name); }}
              >
                <Edit2 size={14} /> Rename
              </div>
              <div 
                className="context-menu-item"
                style={{ padding: '6px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => downloadFile(contextMenu.file)}
              >
                <Download size={14} /> Download
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }}></div>
              <div 
                className="context-menu-item"
                style={{ padding: '6px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error-color)' }}
                onClick={() => handleDeleteFile(contextMenu.file.id)}
              >
                <Trash2 size={14} /> Delete
              </div>
            </>
          ) : (
            <>
              <div 
                className="context-menu-item"
                style={{ padding: '6px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => setIsCreating(true)}
              >
                <FileText size={14} /> New File
              </div>
            </>
          )}
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .context-menu-item:hover {
          background-color: var(--bg-hover);
        }
      `}} />
    </div>
  );
};

export default FileExplorer;
