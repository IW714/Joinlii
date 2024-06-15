const express = require('express');
const { getAllUsers, handleNewUser, getUserById, updateUser, deleteUser} = require('../controllers/registerController');
const router = express.Router();

router.get('/', getAllUsers);
router.post('/', handleNewUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
