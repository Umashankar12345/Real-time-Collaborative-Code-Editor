const express = require('express');
const http = require('http');
const cors = require('cors');

const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// In-memory data store will be used for persistence


// Basic health check route
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
