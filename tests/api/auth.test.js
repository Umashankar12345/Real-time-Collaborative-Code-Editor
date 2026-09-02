const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../backend/server'); // Assuming app is exported from server.js

describe('Auth API Endpoints', () => {
  beforeAll(async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codecollab_test';
    await mongoose.connect(MONGO_URI);
    await mongoose.connection.dropDatabase(); // Clean start
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  const testUser = {
    fullName: 'Auth Test User',
    email: 'auth_test@example.com',
    username: 'authtester',
    password: 'password123'
  };

  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });

  it('should fail to register user with existing email', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toEqual(400);
  });

  it('should login successfully and return token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword'
    });
    expect(res.statusCode).toEqual(400);
  });
});
