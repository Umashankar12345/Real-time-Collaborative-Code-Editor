const express = require('express');
const http = require('http');
const cors = require('cors');

const { Server } = require('socket.io');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Setup Redis Adapter for Socket.IO scalability (Fallback to memory if no Redis)
(async () => {
  try {
    const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();
    
    pubClient.on('error', (err) => console.log('Redis Pub Error (Running without Redis):', err.message));
    subClient.on('error', (err) => console.log('Redis Sub Error (Running without Redis):', err.message));

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    console.log('Redis Adapter connected to Socket.io');
  } catch (error) {
    console.log('Running without Redis Adapter (in-memory mode)');
  }
})();

// Yjs WebSocket Setup
const wss = new WebSocket.Server({ noServer: true });
wss.on('connection', setupWSConnection);

server.on('upgrade', (request, socket, head) => {
  // Only handle connections to /yjs
  if (request.url.startsWith('/yjs')) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
  // Let socket.io handle its own upgrade automatically for other paths
});

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codecollab';
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
connectDB();// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/room');
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Socket.io handlers
require('./socket')(io);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
