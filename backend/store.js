// In-memory data store for the application
// Users: { id (username), password (hashed) }
// Rooms: { id, createdBy, members: [username] }
// Files: { id, roomId, name, content, language }

const users = [];
const rooms = [];
const files = [];

module.exports = {
  users,
  rooms,
  files
};
