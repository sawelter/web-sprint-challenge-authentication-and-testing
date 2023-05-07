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
  test('registering a new user puts the new user in the database', async () => {
    await request(server).post('/api/auth/register').send(izuku);
    const users = await db('users');
    expect(users).toHaveLength(4);
    expect(users[3].username).toEqual(izuku.username);
    expect(users[3].password).not.toEqual(izuku.password);
  })
  test('registering a new user resolves to the new user', async () => {
    const res = await request(server).post('/api/auth/register').send(izuku);
    expect(res.body.username).toEqual(izuku.username);
    expect(res.body.password).not.toEqual(izuku.password);
  })
  test('user cannot be registered if the username is already taken', async () => {
    const res1 = await request(server).post('/api/auth/register').send(izuku);
    const res2 = await request(server).post('/api/auth/register').send(izuku);
    expect(res1.body.username).toEqual(izuku.username);
    expect(res2.body).toEqual('username taken')
  })
  test('user cannot be registered if password or username are missing', async () => {
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


// describe('[POST] /api/auth/login', () => {
  
// })