const db = require('../../data/dbConfig');

async function getAll() {
    return db('users');
}

async function getBy(filter) {
    const user = await db('users').where(filter).first();
    return user;
}

async function insert(user) {
    const [id] = await db('users').insert(user);
    return getBy({id});
}


module.exports = {
    getAll,
    getBy,
    insert
}