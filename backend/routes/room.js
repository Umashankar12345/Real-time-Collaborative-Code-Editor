const express = require('express');
const authMiddleware = require('../middleware/auth');
const { rooms, files } = require('../store');

const router = express.Router();

// Get room details
router.get('/:roomId', authMiddleware, (req, res) => {
  const { roomId } = req.params;
  let room = rooms.find(r => r.id === roomId);
  if (!room) {
    room = { id: roomId, createdBy: req.user.username, members: [] };
    rooms.push(room);
  }
  res.json(room);
});

// Get files for a room
router.get('/:roomId/files', authMiddleware, (req, res) => {
  const { roomId } = req.params;
  const roomFiles = files.filter(f => f.roomId === roomId);
  res.json(roomFiles);
});

// Create a file
router.post('/:roomId/files', authMiddleware, (req, res) => {
  const { roomId } = req.params;
  const { name, language } = req.body;

  if (!name) return res.status(400).json({ message: 'File name required' });

  const id = Date.now().toString();
  const newFile = {
    id,
    roomId,
    name,
    content: '',
    language: language || 'javascript'
  };
  files.push(newFile);
  res.status(201).json(newFile);
});

// Rename file
router.put('/:roomId/files/:fileId/rename', authMiddleware, (req, res) => {
  const { fileId } = req.params;
  const { name } = req.body;
  const file = files.find(f => f.id === fileId);
  if (!file) return res.status(404).json({ message: 'File not found' });

  file.name = name;
  res.json(file);
});

// Delete file
router.delete('/:roomId/files/:fileId', authMiddleware, (req, res) => {
  const { fileId } = req.params;
  const index = files.findIndex(f => f.id === fileId);
  if (index !== -1) {
    files.splice(index, 1);
  }
  res.json({ success: true });
});

// Update file content
router.put('/:roomId/files/:fileId/content', authMiddleware, (req, res) => {
  const { fileId } = req.params;
  const { content } = req.body;
  const file = files.find(f => f.id === fileId);
  if (file) {
    file.content = content;
  }
  res.json({ success: true });
});

// Update file language
router.put('/:roomId/files/:fileId/language', authMiddleware, (req, res) => {
  const { fileId } = req.params;
  const { language } = req.body;
  const file = files.find(f => f.id === fileId);
  if (file) {
    file.language = language;
  }
  res.json({ success: true });
});

module.exports = router;
