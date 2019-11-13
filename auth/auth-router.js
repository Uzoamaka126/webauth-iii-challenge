const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model');

router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users.add(user)
        .then(savedUser => {
            console.log(savedUser)
            res.status(201).json(savedUser)
        })
        .catch((error => {
            res.status(500).json(error);
        }));
});

router.post('/login', (req, res) => {
    let { username, password, department } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          // THIS HERE IS THE PLACE TO MAKE THE TOKEN
          const token = generateToken(user);
          res.status(200).json({
            message: `Welcome ${user.username}!`,
            token: token,
          });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
          console.log(error)
        res.status(500).json(error);
      });
  });

function generateToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
      roles: ['department'],
    }
    const options = {
      expiresIn: '1d',
    }
  
    const result = jwt.sign(
      payload,
      // process.env.NODE_ENV === 'development' ? 'devsecret' : process.env.SECRET,
      'THIS IS THE SECRET',
      options,
    )
  
    return result;
};

module.exports = router;