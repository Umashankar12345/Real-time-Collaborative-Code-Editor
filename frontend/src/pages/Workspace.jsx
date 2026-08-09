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
    
    newSocket.on('connect_error', () => {
      setConnectionStatus('Reconnecting...');
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      
      <TopHeader 
        roomId={roomId}
        connectionStatus={connectionStatus}
        collaborators={collaborators}
        username={user.username}
        onLogout={handleLogout}
        onOpenSettings={() => setShowSettings(true)}
      />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <FileExplorer 
          roomId={roomId}
          token={user.token}
          files={files}
          setFiles={setFiles}
          activeFileId={activeFileId}
          onOpenFile={handleOpenFile}
          socket={socket}
        />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
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
          
          <BottomPanel 
            isOpen={showBottomPanel} 
            onClose={() => setShowBottomPanel(false)} 
          />
        </div>

        <ChatPanel 
          socket={socket} 
          roomId={roomId} 
          username={user.username} 
        />
      </div>
    </div>
  );
};

export default Workspace;
