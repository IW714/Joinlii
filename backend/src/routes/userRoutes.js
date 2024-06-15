const express = require('express');
const { getAllUsers, handleNewUser } = require('../controllers/registerController');
const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('GET /api/users called'); // Debugging log
    next();
}, getAllUsers);

router.post('/', (req, res, next) => {
    console.log('POST /api/users called'); // Debugging log
    next();
}, handleNewUser);

module.exports = router;
