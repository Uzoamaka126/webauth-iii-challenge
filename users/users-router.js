const router = require('express').Router();

const Users = require('./users-model');
const protected = require('../auth/protective-middleware');

router.get('/', protected, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(error => res.send(error));
});

module.exports = router;