const db = require('../../data/dbConfig');
const User = require('./users-model');

beforeEach(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
})

describe('test insert(user)', () => {
    const izuku = { username: 'Izuku Midoriya', password: '1234' };
    test('[1] returns user that has been inserted', async () => {
        const user = await User.insert(izuku);
        expect(user).toMatchObject(izuku);
        expect(user.username).toEqual(izuku.username);
        expect(user.password).toEqual(izuku.password);
    })
    test('[2] user has been successfully inserted into table', async () => {
        User.insert(izuku);
        const users = await db('users');
        expect(users[0]).toMatchObject(izuku); 
    }) 
})

describe('test getBy(filter)', () => {
    const izuku = { username: 'Izuku Midoriya', password: '1234' };
    const bakugo = { username: 'Katsuki Bakugo', password: 'boom' };
    test('[3] user is retrieved by filter', async () => {
        await db('users').insert(izuku);
        await db('users').insert(bakugo);
        const byName = await User.getBy({username: 'Katsuki Bakugo'});
        expect(byName).toMatchObject(bakugo);
        const byId = await User.getBy({id: 1});
        expect(byId).toMatchObject(izuku);
    })
})