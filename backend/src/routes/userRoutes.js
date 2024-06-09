const express = require('express');
const { getAllUsers, handleNewUser } = require('../controllers/registerController');
const router = express.Router();

router.get('/', getAllUsers);
router.post('/', handleNewUser);

module.exports = router;