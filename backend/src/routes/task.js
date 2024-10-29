const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { vertifyJWT } = require('../middlewares/verifyJWT');

const router = express.Router();

router.use(vertifyJWT);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;