const db = require('../data/dbConfig');
const User = require('./users/users-model')

const request = require('supertest');
const server = require('./server')


beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})
beforeEach(async () => {
  await db.seed.run();
})

describe('[POST] /api/auth/register', () => {
  const izuku = { username: 'Izuku Midoriya', password: '12345'};
  test('[1] registering a new user puts the new user in the database', async () => {
    await request(server).post('/api/auth/register').send(izuku);
    const users = await db('users');
    expect(users).toHaveLength(4);
    expect(users[3].username).toEqual(izuku.username);
    expect(users[3].password).not.toEqual(izuku.password);
  })
  test('[2] registering a new user resolves to the new user', async () => {
    const res = await request(server).post('/api/auth/register').send(izuku);
    expect(res.body.username).toEqual(izuku.username);
    expect(res.body.password).not.toEqual(izuku.password);
  })
  test('[3] user cannot be registered if the username is already taken', async () => {
    const res1 = await request(server).post('/api/auth/register').send(izuku);
    const res2 = await request(server).post('/api/auth/register').send(izuku);
    expect(res1.body.username).toEqual(izuku.username);
    expect(res2.body).toEqual('username taken')
  })
  test('[4] user cannot be registered if password or username are missing', async () => {
    const usernameOnly = { username: 'Luke Skywalker'};
    const passwordOnly = { password: '123456'};
    let result = await request(server).post('/api/auth/register').send(usernameOnly);
    expect(result.body).toEqual('username and password required')
    result = await request(server).post('/api/auth/register').send(passwordOnly);
    expect(result.body).toEqual('username and password required')
    result = await request(server).post('/api/auth/register').send({});
    expect(result.body).toEqual('username and password required')

  })
})

/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
describe('[POST] /api/auth/login', () => {
  // existing user in 001-users seed file
  test('[5] user logs in with correct username and password', async () => {
    const bakugo = { username: 'bakugo', password: '1234'};
    const res = await request(server).post('/api/auth/login').send(bakugo);
    expect(res.body.token).toBeDefined();
    expect(res.body.message).toEqual('welcome, bakugo');
  });
  test('[6] fails login if username is not in the database', async () => {
    const deku = { username: 'deku', password: '1234'};
    let res = await request(server).post('/api/auth/login').send(deku);
    expect(res.body).toEqual('invalid credentials');
  });
  test('[7] fails login if password is incorrect', async () => {
    const bakugo = { username: 'bakugo', password: 'password'};
    const res = await request(server).post('/api/auth/login').send(bakugo);
    expect(res.body).toEqual('invalid credentials');

  });
  test('[8] fails log in if password or username are missing from the request body', async () => {
    const usernameOnly = { username: 'bakugo' };
    const passwordOnly = { password: '1234' };
    let result = await request(server).post('/api/auth/login').send(usernameOnly);
    expect(result.body).toEqual('username and password required');
    result = await request(server).post('/api/auth/register').send(passwordOnly);
    expect(result.body).toEqual('username and password required');
    result = await request(server).post('/api/auth/login').send({});
    expect(result.body).toEqual('username and password required');
  });
})