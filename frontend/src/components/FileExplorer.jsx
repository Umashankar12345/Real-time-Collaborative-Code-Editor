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
      className="flex flex-col h-full bg-transparent w-full relative"
      onContextMenu={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          setContextMenu({ x: e.pageX, y: e.pageY, file: null });
        }
      }}
    >
      <div className="px-4 py-3 border-b border-[var(--border-color)] flex justify-between items-center bg-black/20">
        <span className="text-[11px] font-bold tracking-widest text-[var(--text-secondary)]">
          EXPLORER
        </span>
        <div className="flex gap-1">
          <button 
            onClick={() => setIsCreating(true)}
            className="p-1.5 rounded-md text-[var(--text-secondary)] hover:bg-white/10 hover:text-white transition-colors"
            title="New File"
          >
            <FileText size={16} />
          </button>
          <button 
            onClick={() => alert('Folder support coming soon')}
            className="p-1.5 rounded-md text-[var(--text-secondary)] hover:bg-white/10 hover:text-white transition-colors"
            title="New Folder"
          >
            <FolderPlus size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {isCreating && (
          <div className="px-4 py-1.5 flex items-center gap-2 animate-fade-in">
            <File size={16} className="text-[var(--text-secondary)]" />
            <input 
              autoFocus
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFile();
                if (e.key === 'Escape') setIsCreating(false);
              }}
              onBlur={() => setIsCreating(false)}
              className="flex-1 bg-black/30 border border-[var(--accent-color)] rounded text-white px-2 py-0.5 text-[13px] outline-none shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              placeholder="Filename..."
            />
          </div>
        )}
        
        <div className="flex flex-col gap-0.5 px-1">
          {files.map(file => (
            <div 
              key={file.id}
              onClick={() => onOpenFile(file.id)}
              onContextMenu={(e) => handleContextMenu(e, file)}
              className={`px-3 py-1.5 flex items-center cursor-pointer rounded-lg mx-1 transition-all duration-200 group ${
                activeFileId === file.id 
                  ? 'bg-[var(--accent-color)]/20 text-[var(--text-accent)] border border-[var(--accent-color)]/30' 
                  : 'text-[var(--text-primary)] hover:bg-white/5 border border-transparent'
              }`}
            >
              <File 
                size={16} 
                className={`mr-2.5 transition-colors ${activeFileId === file.id ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)] group-hover:text-gray-300'}`} 
              />
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
                  className="flex-1 bg-black/50 border border-[var(--accent-color)] rounded text-white px-1.5 py-0.5 text-[13px] outline-none"
                />
              ) : (
                <span className="truncate font-medium text-[13px]">
                  {file.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {contextMenu && (
        <div 
          className="fixed bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-light)] rounded-lg py-1.5 z-[1000] min-w-[160px] shadow-2xl animate-fade-in"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {contextMenu.file ? (
            <>
              <div 
                className="px-4 py-2 cursor-pointer flex items-center gap-2.5 text-[13px] hover:bg-white/10 transition-colors text-[var(--text-primary)]"
                onClick={() => { setEditingId(contextMenu.file.id); setEditName(contextMenu.file.name); }}
              >
                <Edit2 size={15} /> Rename
              </div>
              <div 
                className="px-4 py-2 cursor-pointer flex items-center gap-2.5 text-[13px] hover:bg-white/10 transition-colors text-[var(--text-primary)]"
                onClick={() => downloadFile(contextMenu.file)}
              >
                <Download size={15} /> Download
              </div>
              <div className="h-px bg-[var(--border-color)] my-1"></div>
              <div 
                className="px-4 py-2 cursor-pointer flex items-center gap-2.5 text-[13px] hover:bg-[var(--error-color)]/20 text-[var(--error-color)] transition-colors"
                onClick={() => handleDeleteFile(contextMenu.file.id)}
              >
                <Trash2 size={15} /> Delete
              </div>
            </>
          ) : (
            <>
              <div 
                className="px-4 py-2 cursor-pointer flex items-center gap-2.5 text-[13px] hover:bg-white/10 transition-colors text-[var(--text-primary)]"
                onClick={() => setIsCreating(true)}
              >
                <FileText size={15} /> New File
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
