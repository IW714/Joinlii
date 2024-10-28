const express = require('express');
const { getAllUsers, handleNewUser, getUserById, updateUser, deleteUser, getUserProfile, updateUserProfile} = require('../controllers/userController');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');

// public routes
router.get('/', getAllUsers);
router.post('/', handleNewUser);

// profile route - should be defined before dynamic routes to avoid conflict
router.get('/profile', verifyJWT, getUserProfile);
router.put('/profile', verifyJWT, updateUserProfile);

// dynamic routes
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);



module.exports = router;
