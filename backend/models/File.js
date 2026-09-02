const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['file', 'folder'], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'File', default: null },
  language: { type: String, default: 'javascript' },
  content: { type: String, default: '' }, // Initial content; Yjs handles real-time updates
}, { timestamps: true });

module.exports = mongoose.model('File', FileSchema);
