const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../users/users-model');
const { checkPayload, checkUsernameAvailable, checkUsernameExists } = require('./auth-middleware')
const { JWT_SECRET } = require('../../config');

// needs: router, bcrypt, jwt, secret, User

// '/api/auth/register'
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
router.post('/register', checkPayload, checkUsernameAvailable, async (req, res, next) => {
  const { username, password } = req.body;

  const hash = bcrypt.hashSync(password, 8);
  const newUser = { username: username, password: hash };
  const result = await User.insert(newUser);
  res.status(201).json(result);
});

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
router.post('/login', checkPayload, checkUsernameExists, (req, res, next) => {
  const { username, password } = req.body;

  User.getBy({username})
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)) {
        const token = buildToken(user);
        res.status(200).json({ message: `welcome, ${user.username}`, token: token});
      } else {
        res.status(400).json('invalid credentials');
      }
    })
    .catch(next);
});



function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1d'
  };
  return jwt.sign(payload, JWT_SECRET, options)
}


module.exports = router;
