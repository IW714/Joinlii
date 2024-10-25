const express = require('express');
const { getAllUsers, handleNewUser, getUserById, updateUser, deleteUser} = require('../controllers/userController');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');

router.get('/', getAllUsers);
router.post('/', handleNewUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
