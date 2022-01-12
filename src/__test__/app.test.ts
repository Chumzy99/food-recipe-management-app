import request from 'supertest';
import app from '../app';

describe('User Authentication', () => {
  it('A user should be created', async () => {
    const data = {
      email: 'mocktest@gmail.com',
      password: '1234chumzy',
      fullname: 'Mock tester',
    };

    const response = await request(app).post('/api/v1/users/signup').send(data);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.user.email).toBe(data.email);
    expect(response.body.data.user.fullname).toBe(data.fullname);
    expect(response.body).toHaveProperty('token');
  });
});
