const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

router.use(verifyJWT);

router.get('/', getTasks,);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;