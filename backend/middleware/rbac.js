const Room = require('../models/Room');

const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { roomId } = req.params;
      const userId = req.user.id;

      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      const member = room.members.find(m => m.user.toString() === userId);
      if (!member) {
        return res.status(403).json({ message: 'Access denied: not a member of this room' });
      }

      if (!allowedRoles.includes(member.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }

      // Pass room and member info to next middleware
      req.room = room;
      req.memberRole = member.role;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error in role check' });
    }
  };
};

module.exports = checkRole;
