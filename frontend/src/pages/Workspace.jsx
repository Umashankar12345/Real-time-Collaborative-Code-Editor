import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import TopHeader from '../components/TopHeader';
import FileExplorer from '../components/FileExplorer';
import EditorArea from '../components/EditorArea';
import ChatPanel from '../components/ChatPanel';
import BottomPanel from '../components/BottomPanel';
import SettingsModal from '../components/SettingsModal';
import StatusBar from '../components/StatusBar';
import { Files, Search, GitBranch, Play, Settings as SettingsIcon } from 'lucide-react';

const Workspace = () => {
  const { roomId } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting');
  const [collaborators, setCollaborators] = useState([]);
  const [files, setFiles] = useState([]);
  
  // Tab Management
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);

  // Layout State
  const [showSettings, setShowSettings] = useState(false);
  const [showBottomPanel, setShowBottomPanel] = useState(true);
  
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      auth: { token: user.token }
    });
    
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      setConnectionStatus('Connected');
      newSocket.emit('room:join', { roomId });
    });
    
    newSocket.on('disconnect', () => {
      setConnectionStatus('Disconnected');
    });
    
    newSocket.on('connect_error', (err) => {
      setConnectionStatus('Reconnecting...');
      if (err.message === 'Authentication error' || err.message === 'invalid token' || err.message === 'xhr poll error') {
        handleLogout();
      }
    });
    
    newSocket.on('presence:list', (users) => setCollaborators(users));
    newSocket.on('presence:user-joined', (newUser) => {
      setCollaborators(prev => {
        if (!prev.find(u => u.username === newUser.username)) {
          return [...prev, newUser];
        }
        return prev;
      });
    });
    newSocket.on('presence:user-left', ({ username }) => {
      setCollaborators(prev => prev.filter(u => u.username !== username));
    });
    
    newSocket.on('file:created', (file) => setFiles(prev => [...prev, file]));
    newSocket.on('file:renamed', ({ fileId, name }) => setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name } : f)));
    newSocket.on('file:deleted', ({ fileId }) => {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      handleCloseTab(fileId);
    });
    newSocket.on('file:language-changed', ({ fileId, language }) => setFiles(prev => prev.map(f => f.id === fileId ? { ...f, language } : f)));

    return () => newSocket.disconnect();
  }, [roomId, user.token]);
  
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/rooms/${roomId}/files`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setFiles(res.data);
      } catch (error) {
        console.error('Error fetching files', error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };
    fetchFiles();
  }, [roomId, user.token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenFile = (fileId) => {
    if (!openFiles.includes(fileId)) {
      setOpenFiles([...openFiles, fileId]);
    }
    setActiveFileId(fileId);
  };

  const handleCloseTab = (fileId) => {
    const newOpenFiles = openFiles.filter(id => id !== fileId);
    setOpenFiles(newOpenFiles);
    if (activeFileId === fileId) {
      setActiveFileId(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#1e1e1e] overflow-hidden font-sans">
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      
      {/* Optional Top Header (Title bar) */}
      <TopHeader 
        roomId={roomId}
        connectionStatus={connectionStatus}
        collaborators={collaborators}
        username={user.username}
        onLogout={handleLogout}
        onOpenSettings={() => setShowSettings(true)}
      />
      
      {/* Main IDE Content */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-var(--header-height)-24px)]">
        
        {/* Activity Bar (VS Code Left Strip) */}
        <div className="w-[var(--activity-bar-width)] bg-[#333333] flex flex-col items-center py-2 gap-4 border-r border-[#252526] shrink-0 z-10 text-[#858585]">
          <div className="p-2 text-white border-l-2 border-[#007acc] cursor-pointer"><Files size={24} strokeWidth={1.5} /></div>
          <div className="p-2 hover:text-white cursor-pointer"><Search size={24} strokeWidth={1.5} /></div>
          <div className="p-2 hover:text-white cursor-pointer"><GitBranch size={24} strokeWidth={1.5} /></div>
          <div className="p-2 hover:text-white cursor-pointer"><Play size={24} strokeWidth={1.5} /></div>
          <div className="mt-auto p-2 hover:text-white cursor-pointer" onClick={() => setShowSettings(true)}><SettingsIcon size={24} strokeWidth={1.5} /></div>
        </div>

        {/* Side Bar (File Explorer) */}
        <div className="w-[var(--sidebar-width)] bg-[#252526] flex flex-col overflow-hidden shrink-0">
          <FileExplorer 
            roomId={roomId}
            token={user.token}
            files={files}
            setFiles={setFiles}
            activeFileId={activeFileId}
            onOpenFile={handleOpenFile}
            socket={socket}
          />
        </div>
        
        {/* Editor Group */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] border-l border-[#3b3b3b]">
          {/* Main Editor View */}
          <div className="flex-1 overflow-hidden flex flex-col relative z-0">
            <EditorArea 
              roomId={roomId}
              token={user.token}
              files={files}
              setFiles={setFiles}
              openFiles={openFiles}
              activeFileId={activeFileId}
              setActiveFileId={setActiveFileId}
              handleCloseTab={handleCloseTab}
              socket={socket}
              onToggleBottomPanel={() => setShowBottomPanel(!showBottomPanel)}
            />
          </div>
          
          {/* Panel (Terminal/Output) */}
          <div className={`transition-all duration-300 ease-in-out bg-[#1e1e1e] flex flex-col border-t border-[#3b3b3b] ${showBottomPanel ? 'h-[250px]' : 'h-0 border-0'}`}>
            <BottomPanel 
              isOpen={showBottomPanel} 
              onClose={() => setShowBottomPanel(false)} 
            />
          </div>
        </div>

        {/* Right Sidebar (Chat) */}
        <div className="w-[300px] bg-[#252526] flex flex-col overflow-hidden border-l border-[#3b3b3b] shrink-0">
          <ChatPanel 
            socket={socket} 
            roomId={roomId} 
            username={user.username} 
          />
        </div>
      </div>
      
      {/* Bottom Status Bar */}
      <StatusBar connectionStatus={connectionStatus} />
    </div>
  );
};

export default Workspace;
