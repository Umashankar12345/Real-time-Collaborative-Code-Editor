import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import axios from 'axios';
import { Save, Cloud, Check } from 'lucide-react';

const EditorArea = ({ roomId, token, file, socket, setFiles }) => {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState(file?.language || 'javascript');
  const [syncStatus, setSyncStatus] = useState('● Synced'); // '● Synced', '↻ Syncing...'
  const editorRef = useRef(null);
  const isRemoteUpdate = useRef(false);
  const decorationsRef = useRef({});
  const monaco = useMonaco();
  
  const languages = ['javascript', 'python', 'cpp', 'java', 'html'];

  useEffect(() => {
    if (file) {
      setContent(file.content || '');
      setLanguage(file.language || 'javascript');
    }
  }, [file]);

  useEffect(() => {
    if (!socket || !file) return;

    const handleDocUpdate = ({ fileId, content: newContent }) => {
      if (fileId === file.id) {
        isRemoteUpdate.current = true;
        setContent(newContent);
      }
    };
    
    const handleCursorUpdate = ({ userId, username, fileId, position, color }) => {
      if (fileId !== file.id || !editorRef.current || !monaco) return;
      
      const decorationId = decorationsRef.current[userId];
      
      const decorations = [
        {
          range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
          options: {
            className: `remote-cursor remote-cursor-${userId}`,
            hoverMessage: { value: username },
            isWholeLine: false,
          }
        }
      ];
      
      // Inject CSS for this specific user's cursor if it doesn't exist
      if (!document.getElementById(`style-${userId}`)) {
        const style = document.createElement('style');
        style.id = `style-${userId}`;
        style.innerHTML = `
          .remote-cursor-${userId} {
            border-left: 2px solid ${color};
            position: relative;
          }
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
          }
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
  }, [socket, file, monaco]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    if (!isRemoteUpdate.current) {
      setContent(value);
      setSyncStatus('↻ Syncing...');
      
      // Emit socket event
      socket?.emit('document:update', { roomId, fileId: file.id, content: value });
      
      // Save to backend occasionally (debounced simulation)
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
    // debounce implementation is omitted for brevity, using simple timeout
    (value) => {
      setTimeout(async () => {
        try {
          await axios.put(
            `http://localhost:5000/api/rooms/${roomId}/files/${file.id}/content`,
            { content: value },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSyncStatus('● Synced');
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Editor Header */}
      <div style={{
        padding: '10px 20px',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '15px', color: 'var(--text-accent)' }}>{file.name}</span>
          
          <select 
            value={language}
            onChange={handleLanguageChange}
            style={{ 
              backgroundColor: 'var(--bg-tertiary)', 
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
              padding: '4px 8px',
              borderRadius: '4px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          {syncStatus === '● Synced' ? <Check size={14} color="var(--success-color)"/> : <Cloud size={14} />}
          <span>{syncStatus}</span>
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, paddingBottom: '20px' }}>
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
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
      
      {/* Attach listener to Monaco after mount if needed. We can do it inside Editor container. */}
      {editorRef.current && (
         <div style={{ display: 'none' }}>
           {/* Setup cursor listener */}
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
