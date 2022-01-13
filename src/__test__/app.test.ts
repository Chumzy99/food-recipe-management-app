import request from 'supertest';
import app from '../app';

let token = '';
let recipeId = '';

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

    token = response.body.token;

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
    const dataC = {
      title: 'Gambian Olinga',
      meal_type: 'breakfast',
      difficulty_level: 'advanced',
      preparationMinutes: 40,
      //   user: '61dcd6e1738f045dc3f33147',
      ingredients: [
        {
          name: 'raw rice',
          price: 900,
        },
        {
          name: 'maggi',
          price: 100,
        },
      ],
      preparation: 'boil water, pour rice, add maggi and bring down',
    };

    const response = await request(app)
      .post('/api/v1/recipes')
      .send(dataC)
      .set('Authorization', `Bearer ${token}`);

    recipeId = response.body.data.id;

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toHaveProperty('id');
  });
});

// GET RECIPE ROUTES
describe('Get one recipe', () => {
  it('Get One Recipe', async () => {
    const response = await request(app)
      .get(`/api/v1/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body).toHaveProperty('data');
  });
});

// GET ALL RECIPE ROUTES
describe('Get All recipe by a user', () => {
  it('Get All Recipe', async () => {
    const response = await request(app)
      .get(`/api/v1/recipes`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success.');
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

// UPDATE RECIPE ROUTES
describe('Update a recipe on the database', () => {
  it('Update a Recipe', async () => {
    const data = {
      difficulty_level: 'beginner',
    };
    const response = await request(app)
      .patch(`/api/v1/recipes/${recipeId}`)
      .send(data)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.difficulty_level).toBe(data.difficulty_level);
  });
});

// UPDATE RECIPE ROUTES
describe('Delete a recipe on the database', () => {
  it('Delete a Recipe', async () => {
    const response = await request(app)
      .delete(`/api/v1/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${token}`);

    console.log(response);
    expect(response.status).toBe(204);
  });
});
