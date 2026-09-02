import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import axios from 'axios';
import { Save, Cloud, Check, Play, Square, Bug, X, Search, Terminal } from 'lucide-react';
import { SettingsContext } from '../contexts/SettingsContext';
import { AuthContext } from '../contexts/AuthContext';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';

const EditorArea = ({ roomId, token, files, setFiles, openFiles, activeFileId, setActiveFileId, handleCloseTab, socket, onToggleBottomPanel, setExecutionResult, setIsExecuting, isExecuting, setShowBottomPanel }) => {
  const file = files.find(f => f.id === activeFileId);
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [syncStatus, setSyncStatus] = useState('✓ Synced'); // '● Saving...', '✓ Saved locally', '✓ Synced'
  
  const { settings } = useContext(SettingsContext);
  const { user } = useContext(AuthContext);
  
  const editorRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);
  const ydocRef = useRef(null);
  const monaco = useMonaco();
  
  const languages = ['javascript', 'typescript', 'python', 'cpp', 'java', 'c', 'go', 'html', 'css', 'json'];

  useEffect(() => {
    if (file) {
      setContent(file.content || '');
      setLanguage(file.language || 'javascript');
      setSyncStatus('✓ Synced');
    }
  }, [file]);

  // Setup Yjs whenever the active file changes or editor mounts
  useEffect(() => {
    if (!file || !editorRef.current || !monaco) return;

    // 1. Initialize Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // 2. Connect to y-websocket server
    const roomName = `${roomId}-${file.id}`;
    const wsUrl = 'ws://localhost:5000/yjs'; // The path configured in server.js
    const provider = new WebsocketProvider(wsUrl, roomName, ydoc);
    providerRef.current = provider;

    // 3. Set Awareness (Cursors)
    if (user) {
      provider.awareness.setLocalStateField('user', {
        name: user.fullName || user.username || 'Anonymous',
        color: getColorForUser(user.username || 'Anonymous')
      });
    }

    // 4. Bind Yjs to Monaco Editor
    const type = ydoc.getText('monaco');
    const binding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
    bindingRef.current = binding;

    // Listen for sync events
    provider.on('status', event => {
      if (event.status === 'connected') {
        setSyncStatus('✓ Synced with room');
      } else {
        setSyncStatus('● Reconnecting...');
      }
    });

    return () => {
      binding.destroy();
      provider.disconnect();
      ydoc.destroy();
    };
  }, [file?.id, roomId, editorRef.current, monaco, user]);

  // Helper to generate consistent colors for awareness
  const getColorForUser = (username) => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3', '#F3FF33', '#FF3380'];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('dracula', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { background: '282a36' },
          { token: '', foreground: 'f8f8f2', background: '282a36' },
          { token: 'comment', foreground: '6272a4' },
          { token: 'keyword', foreground: 'ff79c6' },
          { token: 'string', foreground: 'f1fa8c' },
          { token: 'number', foreground: 'bd93f9' },
          { token: 'type', foreground: '8be9fd' },
          { token: 'function', foreground: '50fa7b' }
        ],
        colors: {
          'editor.background': '#282a36',
          'editor.foreground': '#f8f8f2',
          'editor.lineHighlightBackground': '#44475a',
          'editorLineNumber.foreground': '#6272a4',
          'editor.selectionBackground': '#44475a'
        }
      });

      monaco.editor.defineTheme('monokai', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { background: '272822' },
          { token: '', foreground: 'f8f8f2', background: '272822' },
          { token: 'comment', foreground: '75715e' },
          { token: 'keyword', foreground: 'f92672' },
          { token: 'string', foreground: 'e6db74' },
          { token: 'number', foreground: 'ae81ff' },
          { token: 'type', foreground: '66d9ef' },
          { token: 'function', foreground: 'a6e22e' }
        ],
        colors: {
          'editor.background': '#272822',
          'editor.foreground': '#f8f8f2',
          'editor.lineHighlightBackground': '#3e3d32',
          'editorLineNumber.foreground': '#90908a',
          'editor.selectionBackground': '#49483e'
        }
      });
      monaco.editor.defineTheme('github-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { background: '24292e' },
          { token: 'comment', foreground: '6a737d' },
          { token: 'keyword', foreground: 'd73a49' },
          { token: 'string', foreground: '032f62' },
          { token: 'number', foreground: '005cc5' }
        ],
        colors: {
          'editor.background': '#24292e',
          'editor.foreground': '#e1e4e8',
          'editor.lineHighlightBackground': '#2b3036',
          'editorLineNumber.foreground': '#444d56',
          'editor.selectionBackground': '#3392FF44'
        }
      });
    }
  }, [monaco]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add custom styles for Yjs remote cursors
    if (!document.getElementById('yjs-cursor-styles')) {
      const style = document.createElement('style');
      style.id = 'yjs-cursor-styles';
      style.innerHTML = `
        .yRemoteSelection {
          background-color: rgba(250, 129, 0, 0.5);
        }
        .yRemoteSelectionHead {
          position: absolute;
          border-left: 2px solid orange;
          height: 100%;
        }
        .yRemoteSelectionHead::after {
          position: absolute;
          content: attr(data-client-name);
          top: -1.2em;
          left: -2px;
          background-color: orange;
          color: white;
          font-size: 11px;
          padding: 2px 4px;
          border-radius: 2px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 10;
        }
      `;
      document.head.appendChild(style);
    }
  };

  const handleEditorChange = (value) => {
    // With Yjs, we no longer need to emit socket events for every keystroke.
    // The MonacoBinding handles everything internally!
    // We only need to periodically save to the backend for persistence if desired,
    // though y-websocket can also persist on the server side using LevelDB/Redis.
    saveToBackend(value);
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

  const handleRunCode = async () => {
    if (!file || isExecuting) return;
    setIsExecuting(true);
    setShowBottomPanel(true);
    setExecutionResult({ type: 'running', message: `Executing ${file.name}...` });

    try {
      const response = await axios.post(
        `http://localhost:5000/api/rooms/${roomId}/files/${file.id}/execute`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExecutionResult({ type: 'success', data: response.data });
    } catch (error) {
      setExecutionResult({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error executing code' 
      });
    } finally {
      setIsExecuting(false);
    }
  };

  if (!file) {
    return (
      <div className="flex flex-1 justify-center items-center text-[var(--text-secondary)] bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-16 h-16 bg-[#252526] flex items-center justify-center">
            <Search size={24} className="text-[#3b3b3b]" />
          </div>
          <p className="font-medium tracking-wide text-xs">Select a file to start collaborating</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg-primary)]">
      {/* Tabs */}
      <div className="flex overflow-x-auto bg-[#252526] custom-scrollbar shrink-0">
        {openFiles.map(id => {
          const tabFile = files.find(f => f.id === id);
          if (!tabFile) return null;
          const isActive = id === activeFileId;
          return (
            <div 
              key={id} 
              onClick={() => setActiveFileId(id)}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors border-t-2 border-r border-r-[var(--border-color)] text-[13px] ${
                isActive 
                  ? 'bg-black/30 border-t-[var(--accent-color)] text-[var(--text-accent)] shadow-sm' 
                  : 'bg-transparent border-t-transparent text-[var(--text-secondary)] hover:bg-white/5'
              }`}
            >
              <span className="font-medium">{tabFile.name}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); handleCloseTab(id); }}
                className={`flex items-center p-0.5 rounded-sm transition-colors ${
                  isActive ? 'text-[var(--text-secondary)] hover:text-white hover:bg-white/10' : 'text-transparent group-hover:text-[var(--text-secondary)] hover:bg-white/10'
                }`}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Editor */}
      <>
          {/* Editor Toolbar */}
          <div className="px-3 py-1.5 bg-[#252526] border-y border-[#3b3b3b] flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-[var(--border-color)] pr-4">
            <button 
              onClick={handleRunCode}
              disabled={isExecuting}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors text-[13px] font-medium ${
                isExecuting 
                  ? 'text-gray-400 cursor-not-allowed opacity-60' 
                  : 'text-[var(--success-color)] hover:bg-white/5 opacity-90'
              }`}
            >
              <Play size={14} className={isExecuting ? "animate-pulse" : ""} /> 
              <span className="hidden sm:inline">{isExecuting ? 'Running...' : 'Run'}</span>
            </button>
            <button className="flex items-center gap-1.5 text-[var(--error-color)] opacity-60 cursor-not-allowed hover:bg-white/5 px-2 py-1 rounded transition-colors text-[13px] font-medium">
              <Square size={14} /> <span className="hidden sm:inline">Stop</span>
            </button>
            <button className="flex items-center gap-1.5 text-[var(--warning-color)] opacity-60 cursor-not-allowed hover:bg-white/5 px-2 py-1 rounded transition-colors text-[13px] font-medium">
              <Bug size={14} /> <span className="hidden sm:inline">Debug</span>
            </button>
          </div>
          
          <select 
            value={language}
            onChange={handleLanguageChange}
            className="bg-black/30 text-[var(--text-primary)] border border-[var(--border-light)] px-3 py-1 rounded-md outline-none text-[12px] font-medium cursor-pointer hover:border-[var(--accent-color)] transition-colors appearance-none pr-8 relative"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px top 50%', backgroundSize: '10px auto' }}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
          </select>
          
          <button className="text-[var(--text-secondary)] hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors">
            <Search size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[var(--text-secondary)] bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            {syncStatus.includes('✓') ? <Check size={14} className="text-[var(--success-color)]"/> : <Cloud size={14} className="text-[var(--accent-color)] animate-pulse" />}
            <span>{syncStatus}</span>
          </div>
          <button onClick={() => window.open('https://github.com', '_blank')} className="text-[var(--text-secondary)] hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors" title="View on GitHub">
            GitHub
          </button>
          <button onClick={onToggleBottomPanel} className="text-[var(--text-secondary)] hover:text-white hover:bg-[var(--accent-color)]/20 hover:text-[var(--accent-color)] p-1.5 rounded transition-colors" title="Toggle Terminal">
            <Terminal size={16} />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-[#0b0f19]/80 backdrop-blur-md relative">
        <Editor
          height="100%"
          language={language}
          theme={settings.theme || 'vs-dark'}
          value={content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: settings.minimap },
            fontSize: settings.fontSize,
            wordWrap: settings.wordWrap,
            tabSize: settings.tabSize,
            fontFamily: 'var(--font-mono)',
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
            renderWhitespace: 'selection',
            lineNumbersMinChars: 4,
            lineDecorationsWidth: 10,
          }}
        />
      </div>
      

        </>
      )}
    </div>
  );
};

export default EditorArea;
