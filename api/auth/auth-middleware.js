const User = require('../users/users-model');

/*
    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */


function checkPayload(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json('username and password required');
    } else {
        next();
    }
}

async function checkUsernameAvailable(req, res, next) {
    try {
        const { username } = req.body;
        const user = await User.getBy({ username });
        if (user) {
            res.status(400).json('username taken');
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
}

async function checkUsernameExists(req, res, next) {
    console.log('running thru checkUsernameExists')
    try {
        const { username } = req.body;
        const user = await User.getBy({username});
        if(!user) {
            res.status(400).json('invalid credentials');
        } else {
            next();
        }
    } catch(err) {
        next(err);
    }
}


module.exports = {
    checkUsernameAvailable,
    checkPayload,
    checkUsernameExists
}