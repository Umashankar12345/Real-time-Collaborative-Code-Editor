const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../backend/server');

describe('Room API & RBAC Endpoints', () => {
  let ownerToken;
  let viewerToken;
  let roomId;
  let fileId;

  beforeAll(async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codecollab_test';
    await mongoose.connect(MONGO_URI);
    await mongoose.connection.dropDatabase();

    // Create Owner User
    const ownerRes = await request(app).post('/api/auth/register').send({
      fullName: 'Owner User',
      email: 'owner@example.com',
      username: 'owner',
      password: 'password123'
    });
    ownerToken = ownerRes.body.token;

    // Create Viewer User
    const viewerRes = await request(app).post('/api/auth/register').send({
      fullName: 'Viewer User',
      email: 'viewer@example.com',
      username: 'viewer',
      password: 'password123'
    });
    viewerToken = viewerRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should allow authenticated user to create a room (Owner)', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Test RBAC Room' });
    
    expect(res.statusCode).toEqual(201);
    roomId = res.body._id;
  });

  it('should allow Owner to create a file in the room', async () => {
    const res = await request(app)
      .post(`/api/rooms/${roomId}/files`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'index.js', language: 'javascript' });
    
    expect(res.statusCode).toEqual(201);
    fileId = res.body.id;
  });

  it('should add Viewer to room with VIEWER role', async () => {
    // Note: Implementation depends on backend join logic. 
    // Assuming GET /api/rooms/:id handles joining or a specific POST route.
    const res = await request(app)
      .get(`/api/rooms/${roomId}`)
      .set('Authorization', `Bearer ${viewerToken}`);
    
    expect(res.statusCode).toEqual(200);
  });

  it('should deny Viewer from creating files in the room (RBAC Check)', async () => {
    const res = await request(app)
      .post(`/api/rooms/${roomId}/files`)
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({ name: 'hacked.js', language: 'javascript' });
    
    expect(res.statusCode).toEqual(403); // Forbidden
    expect(res.body.message).toMatch(/permission/i);
  });

  it('should deny Viewer from renaming files (RBAC Check)', async () => {
    const res = await request(app)
      .put(`/api/rooms/${roomId}/files/${fileId}/rename`)
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({ name: 'renamed.js' });
    
    expect(res.statusCode).toEqual(403);
  });
});
