const express = require('express');
const { getAllUsers, handleNewUser, getUserById, updateUser, deleteUser, getUserProfile, updateUserProfile} = require('../controllers/userController');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');

router.get('/', getAllUsers);
router.post('/', handleNewUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// profile route
router.get('/profile', verifyJWT, getUserProfile);
router.put('/profile', verifyJWT, updateUserProfile);

module.exports = router;
