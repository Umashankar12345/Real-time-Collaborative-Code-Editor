import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import axios from 'axios';
import { Save, Cloud, Check, Play, Square, Bug, X, Search, Terminal } from 'lucide-react';
import { SettingsContext } from '../contexts/SettingsContext';

const EditorArea = ({ roomId, token, files, setFiles, openFiles, activeFileId, setActiveFileId, handleCloseTab, socket, onToggleBottomPanel }) => {
  const file = files.find(f => f.id === activeFileId);
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [syncStatus, setSyncStatus] = useState('✓ Synced'); // '● Saving...', '✓ Saved locally', '✓ Synced'
  
  const { settings } = useContext(SettingsContext);
  
  const editorRef = useRef(null);
  const isRemoteUpdate = useRef(false);
  const decorationsRef = useRef({});
  const monaco = useMonaco();
  
  const languages = ['javascript', 'typescript', 'python', 'cpp', 'java', 'c', 'go', 'html', 'css', 'json'];

  useEffect(() => {
    if (file) {
      setContent(file.content || '');
      setLanguage(file.language || 'javascript');
      setSyncStatus('✓ Synced');
    }
  }, [file]);

  useEffect(() => {
    if (!socket || !file) return;

    const handleDocUpdate = ({ fileId, content: newContent }) => {
      if (fileId === file.id) {
        isRemoteUpdate.current = true;
        setContent(newContent);
        setSyncStatus('✓ Synced with room');
      }
    };
    
    const handleCursorUpdate = ({ userId, username, fileId, position, color }) => {
      if (fileId !== file.id || !editorRef.current || !monaco || !settings.showCursors) return;
      
      const decorationId = decorationsRef.current[userId];
      
      const hoverMessage = settings.showUserNames ? { value: username } : undefined;
      
      const decorations = [
        {
          range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
          options: {
            className: `remote-cursor remote-cursor-${userId}`,
            hoverMessage,
            isWholeLine: false,
          }
        }
      ];
      
      if (!document.getElementById(`style-${userId}`)) {
        const style = document.createElement('style');
        style.id = `style-${userId}`;
        style.innerHTML = `
          .remote-cursor-${userId} {
            border-left: 2px solid ${color};
            position: relative;
          }
          ${settings.showUserNames ? `
          .remote-cursor-${userId}::after {
            content: '${username}';
            position: absolute;
            top: -18px;
            left: 0;
            background-color: ${color};
            color: white;
            font-size: 10px;
            padding: 2px 4px;
            border-radius: 2px;
            white-space: nowrap;
            z-index: 10;
            pointer-events: none;
          }` : ''}
        `;
        document.head.appendChild(style);
      }
      
      const newDecorationId = editorRef.current.deltaDecorations(
        decorationId ? decorationId : [], 
        decorations
      );
      
      decorationsRef.current[userId] = newDecorationId;
    };

    socket.on('document:update', handleDocUpdate);
    socket.on('cursor:update', handleCursorUpdate);

    return () => {
      socket.off('document:update', handleDocUpdate);
      socket.off('cursor:update', handleCursorUpdate);
    };
  }, [socket, file, monaco, settings.showCursors, settings.showUserNames]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    if (!isRemoteUpdate.current) {
      setContent(value);
      setSyncStatus('● Saving...');
      
      socket?.emit('document:update', { roomId, fileId: file.id, content: value });
      
      saveToBackend(value);
    } else {
      isRemoteUpdate.current = false;
    }
  };

  const handleCursorSelectionChange = (e) => {
    if (socket && file && e.selection) {
      socket.emit('cursor:update', {
        roomId,
        fileId: file.id,
        position: e.selection.getPosition()
      });
    }
  };

  const saveToBackend = useCallback(
    (value) => {
      setTimeout(async () => {
        try {
          await axios.put(
            `http://localhost:5000/api/rooms/${roomId}/files/${file.id}/content`,
            { content: value },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSyncStatus('✓ Saved locally');
        } catch (error) {
          setSyncStatus('Error saving');
        }
      }, 1000);
    },
    [file, roomId, token]
  );

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setFiles(prev => prev.map(f => f.id === file.id ? { ...f, language: newLang } : f));
    
    try {
      await axios.put(
        `http://localhost:5000/api/rooms/${roomId}/files/${file.id}/language`,
        { language: newLang },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket?.emit('file:language', { roomId, fileId: file.id, language: newLang });
    } catch (err) {
      console.error(err);
    }
  };

  if (!file) {
    return (
      <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
        Select a file to start collaborating
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', overflowX: 'auto', borderBottom: '1px solid var(--border-color)' }}>
        {openFiles.map(id => {
          const tabFile = files.find(f => f.id === id);
          if (!tabFile) return null;
          const isActive = id === activeFileId;
          return (
            <div 
              key={id} 
              onClick={() => setActiveFileId(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                backgroundColor: isActive ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                borderTop: isActive ? '2px solid var(--accent-color)' : '2px solid transparent',
                borderRight: '1px solid var(--border-color)',
                color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                fontSize: '13px'
              }}
            >
              <span>{tabFile.name}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); handleCloseTab(id); }}
                style={{ display: 'flex', alignItems: 'center', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Editor Toolbar */}
      <div style={{
        padding: '8px 16px',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--border-color)', paddingRight: '16px' }}>
            <button title="Run (Execution not configured)" style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.6, cursor: 'not-allowed' }}>
              <Play size={16} /> Run
            </button>
            <button title="Stop" style={{ color: 'var(--error-color)', display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.6, cursor: 'not-allowed' }}>
              <Square size={16} /> Stop
            </button>
            <button title="Debug" style={{ color: 'var(--warning-color)', display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.6, cursor: 'not-allowed' }}>
              <Bug size={16} /> Debug
            </button>
          </div>
          
          <select 
            value={language}
            onChange={handleLanguageChange}
            style={{ 
              backgroundColor: 'var(--bg-tertiary)', 
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
              padding: '2px 8px',
              borderRadius: '4px',
              outline: 'none',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
          </select>
          
          <button style={{ color: 'var(--text-secondary)' }} title="Search (Ctrl+F)">
            <Search size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {syncStatus.includes('✓') ? <Check size={14} color="var(--success-color)"/> : <Cloud size={14} />}
            <span>{syncStatus}</span>
          </div>
          <button onClick={onToggleBottomPanel} style={{ color: 'var(--text-secondary)' }} title="Toggle Bottom Panel">
            <Terminal size={16} />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, paddingBottom: '0px' }}>
        <Editor
          height="100%"
          language={language}
          theme={settings.theme}
          value={content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: settings.minimap },
            fontSize: settings.fontSize,
            wordWrap: settings.wordWrap,
            tabSize: settings.tabSize,
            fontFamily: 'var(--font-mono)',
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
            renderWhitespace: 'selection',
          }}
        />
      </div>
      
      {editorRef.current && (
         <div style={{ display: 'none' }}>
           {setTimeout(() => {
              if (editorRef.current && !editorRef.current._hasAttachedCursorListener) {
                editorRef.current.onDidChangeCursorPosition(handleCursorSelectionChange);
                editorRef.current._hasAttachedCursorListener = true;
              }
           }, 100)}
         </div>
      )}
    </div>
  );
};

export default EditorArea;
