const jwt = require('jsonwebtoken');
const { rooms, files } = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

const connectedUsers = new Map(); // socketId -> { username, roomId, color }

const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3', '#F3FF33', '#FF3380'];

const getColorForUser = (username) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const username = socket.user.username;
    
    socket.on('room:join', ({ roomId }) => {
      socket.join(roomId);
      const color = getColorForUser(username);
      connectedUsers.set(socket.id, { username, roomId, color });
      
      // Notify others in room
      socket.to(roomId).emit('presence:user-joined', { username, color });
      
      // Send current users in room to the newly joined user
      const usersInRoom = Array.from(connectedUsers.values())
        .filter(u => u.roomId === roomId);
      
      // De-duplicate usernames for presence list (in case a user opens multiple tabs)
      const uniqueUsers = [];
      const seen = new Set();
      for (const u of usersInRoom) {
        if (!seen.has(u.username)) {
          seen.add(u.username);
          uniqueUsers.push({ username: u.username, color: u.color });
        }
      }
      
      socket.emit('presence:list', uniqueUsers);
    });

    socket.on('document:update', ({ roomId, fileId, content }) => {
      // Update in-memory file
      const file = files.find(f => f.id === fileId);
      if (file) {
        file.content = content;
      }
      // Broadcast to others
      socket.to(roomId).emit('document:update', { fileId, content });
    });

    socket.on('cursor:update', ({ roomId, fileId, position }) => {
      const userData = connectedUsers.get(socket.id);
      if (userData) {
        socket.to(roomId).emit('cursor:update', {
          userId: username,
          username,
          fileId,
          position,
          color: userData.color
        });
      }
    });
    
    socket.on('file:create', ({ roomId, file }) => {
      socket.to(roomId).emit('file:created', file);
    });
    
    socket.on('file:rename', ({ roomId, fileId, name }) => {
      socket.to(roomId).emit('file:renamed', { fileId, name });
    });
    
    socket.on('file:delete', ({ roomId, fileId }) => {
      socket.to(roomId).emit('file:deleted', { fileId });
    });
    
    socket.on('file:language', ({ roomId, fileId, language }) => {
      socket.to(roomId).emit('file:language-changed', { fileId, language });
    });

    socket.on('disconnect', () => {
      const userData = connectedUsers.get(socket.id);
      if (userData) {
        const { roomId, username } = userData;
        connectedUsers.delete(socket.id);
        
        // Check if user has other open tabs
        const isStillInRoom = Array.from(connectedUsers.values())
          .some(u => u.username === username && u.roomId === roomId);
          
        if (!isStillInRoom) {
          socket.to(roomId).emit('presence:user-left', { username });
        }
      }
    });
  });
};
