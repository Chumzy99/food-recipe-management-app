import request from 'supertest';
import app from '../app';

let token: string;

//SIGN UP
describe('User Authentication', () => {
  it('A user should be created', async () => {
    const data = {
      email: 'mocktest@gmail.com',
      password: '1234chumzy',
      fullname: 'Mock tester',
    };

    const response = await request(app).post('/api/v1/users/signup').send(data);

    token = response.body.token;

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.user.email).toBe(data.email);
    expect(response.body.data.user.fullname).toBe(data.fullname);
    expect(response.body).toHaveProperty('token');
  });

  // Login Testing
  it('A user should be sent a login Token!', async () => {
    const data = {
      email: 'mocktest@gmail.com',
      password: '1234chumzy',
      fullname: 'Mock tester',
    };

    const response = await request(app).post('/api/v1/users/login').send(data);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.user.email).toBe(data.email);
    expect(response.body.data.user.fullname).toBe(data.fullname);
    expect(response.body).toHaveProperty('token');
  });
});

// RECIPE ROUTES
describe('Create and add a new recipe to the database', () => {
  it('Create Recipe by User', async () => {
    const data = {
      email: 'mocktest@gmail.com',
      password: '1234chumzy',
      fullname: 'Mock tester',
    };

    const response = await request(app)
      .post('/api/v1/recipe')
      .send(data)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.user.email).toBe(data.email);
    expect(response.body.data.user.fullname).toBe(data.fullname);
    expect(response.body).toHaveProperty('token');
  });
});
