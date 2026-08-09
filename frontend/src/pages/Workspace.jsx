import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import TopHeader from '../components/TopHeader';
import FileExplorer from '../components/FileExplorer';
import EditorArea from '../components/EditorArea';

const Workspace = () => {
  const { roomId } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting');
  const [collaborators, setCollaborators] = useState([]);
  const [files, setFiles] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);
  
  useEffect(() => {
    // Setup Socket
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
    
    // Presence events
    newSocket.on('presence:list', (users) => {
      setCollaborators(users);
    });
    
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
    
    // File events
    newSocket.on('file:created', (file) => {
      setFiles(prev => [...prev, file]);
    });
    
    newSocket.on('file:renamed', ({ fileId, name }) => {
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name } : f));
    });
    
    newSocket.on('file:deleted', ({ fileId }) => {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      if (activeFileId === fileId) setActiveFileId(null);
    });
    
    newSocket.on('file:language-changed', ({ fileId, language }) => {
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, language } : f));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, user.token]);
  
  // Fetch initial files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/rooms/${roomId}/files`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setFiles(res.data);
        if (res.data.length > 0) {
          setActiveFileId(res.data[0].id);
        }
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <TopHeader 
        roomId={roomId}
        connectionStatus={connectionStatus}
        collaborators={collaborators}
        username={user.username}
        onLogout={handleLogout}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <FileExplorer 
          roomId={roomId}
          token={user.token}
          files={files}
          setFiles={setFiles}
          activeFileId={activeFileId}
          setActiveFileId={setActiveFileId}
          socket={socket}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeFileId ? (
            <EditorArea 
              roomId={roomId}
              token={user.token}
              file={files.find(f => f.id === activeFileId)}
              socket={socket}
              setFiles={setFiles}
            />
          ) : (
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
              Select a file to start collaborating
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
