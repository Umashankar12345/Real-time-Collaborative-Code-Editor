const express = require('express');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/rbac');
const Room = require('../models/Room');
const File = require('../models/File');

const router = express.Router();

// Get room details or create if doesn't exist (basic implementation for the interview dashboard)
router.get('/:roomId', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    let room = await Room.findById(roomId).populate('members.user', 'username fullName avatar');
    
    // Auto-create room if it doesn't exist (for seamless joining in this demo architecture)
    // In a strict prod environment, we would return 404 and require explicit creation.
    if (!room) {
      // Check if it's a valid ObjectId, otherwise it might throw. 
      // Assuming roomId is an ObjectId for this route, if not, we must handle it.
      // If the dashboard uses strings like "room-1234", we should use a custom ID or string field.
      // Wait, Room._id is an ObjectId. We should find by 'name' or a custom 'roomId' string.
      // Let's assume we'll just return 404 and make the client create it properly.
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Room
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const room = new Room({
      name: name || 'Untitled Room',
      ownerId: req.user.id,
      members: [{ user: req.user.id, role: 'Owner' }]
    });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get files for a room
router.get('/:roomId/files', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const files = await File.find({ roomId });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a file (Requires Admin or Owner or Editor)
router.post('/:roomId/files', authMiddleware, checkRole(['Owner', 'Admin', 'Editor']), async (req, res) => {
  try {
    const { roomId } = req.params;
    const { name, language, type, parentId } = req.body;

    if (!name) return res.status(400).json({ message: 'File name required' });

    const newFile = new File({
      roomId,
      name,
      type: type || 'file',
      parentId: parentId || null,
      language: language || 'javascript',
      content: ''
    });
    await newFile.save();
    res.status(201).json(newFile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Rename file
router.put('/:roomId/files/:fileId/rename', authMiddleware, checkRole(['Owner', 'Admin', 'Editor']), async (req, res) => {
  try {
    const { fileId } = req.params;
    const { name } = req.body;
    
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    file.name = name;
    await file.save();
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete file
router.delete('/:roomId/files/:fileId', authMiddleware, checkRole(['Owner', 'Admin', 'Editor']), async (req, res) => {
  try {
    const { fileId } = req.params;
    await File.findByIdAndDelete(fileId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update file content
router.put('/:roomId/files/:fileId/content', authMiddleware, checkRole(['Owner', 'Admin', 'Editor']), async (req, res) => {
  try {
    const { fileId } = req.params;
    const { content } = req.body;
    const file = await File.findById(fileId);
    if (file) {
      file.content = content;
      await file.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update file language
router.put('/:roomId/files/:fileId/language', authMiddleware, checkRole(['Owner', 'Admin', 'Editor']), async (req, res) => {
  try {
    const { fileId } = req.params;
    const { language } = req.body;
    const file = await File.findById(fileId);
    if (file) {
      file.language = language;
      await file.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const axios = require('axios');

// ... existing code ...

// Execute Code via Piston API Sandbox
router.post('/:roomId/files/:fileId/execute', authMiddleware, checkRole(['Owner', 'Admin', 'Editor', 'Viewer']), async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    const languageMap = {
      'javascript': { language: 'javascript', version: '18.15.0' },
      'python': { language: 'python', version: '3.10.0' },
      'cpp': { language: 'c++', version: '10.2.0' },
      'c': { language: 'c', version: '10.2.0' },
      'java': { language: 'java', version: '15.0.2' },
      'go': { language: 'go', version: '1.16.2' }
    };

    const runConfig = languageMap[file.language];
    if (!runConfig) {
      return res.status(400).json({ message: `Execution not supported for language: ${file.language}` });
    }

    const payload = {
      language: runConfig.language,
      version: runConfig.version,
      files: [{ content: file.content }]
    };

    const response = await axios.post('https://emkc.org/api/v2/piston/execute', payload);
    const result = response.data.run;

    res.json({
      stdout: result.stdout,
      stderr: result.stderr,
      code: result.code,
      signal: result.signal
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error executing code' });
  }
});

module.exports = router;
