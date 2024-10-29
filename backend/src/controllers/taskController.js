const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const createTask = async (req, res) => {
    const { title, content, status, dueDate, groupId, images } = req.body;
    const userId = req.userId; // verifyJWT middleware attaches user to req object

    try {
        const newTask = await prisma.task.create({
            data: {
                title,
                content,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
                userId,
                groupId: groupId || null,
                images: {
                    create: images?.map((url) => ({ url })) || [],
                },
            },
            include: { images: true, group: true},
        });
        res.status(201).json(newTask);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ message: 'Interal Server Error' });
    }
};

const getTasks = async (req, res) => {
    const userId = req.userId;

    try {
        const tasks = await prisma.task.findMany({
            where: { userId },
            include: { images: true, group: true },
            orderBy: { status: 'asc'} // TODO: may order differently (by due date)
        });
        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error retrieving tasks:', err);
        res.status(500).json({ message: 'Interal Server Error' });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, content, status, dueDate, groupId, images } = req.body;
    const userId = req.userId;

    try {
        const existingTask = await prisma.task.findUnique({
            where: { id },
            include: { images: true }, 
        });
        if (!existingTask || existingTask.userId !== userId) { // TODO: may implement ability for other users to edit tasks
            return res.status(404).json({ message: 'Task not found' }); 
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                title: title ?? existingTask.title,
                content: content ?? existingTask.content,
                status: status ?? existingTask.status,
                dueDate: dueDate ? new Date(dueDate) : existingTask.dueDate,
                groupId: groupId ?? existingTask.groupId,
                images: {
                    deleteMany: {},
                    create: images?.map((url) => ({ url })) || [],
                },
            },
            include: { images: true, group: true },
        });

        res.status(200).json(updatedTask);
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ message: 'Interal Server Error' });
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const existingTask = await prisma.task.findUnique({
            where: { id },
        });

        if (!existingTask || existingTask.userId !== userId) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await prisma.task.delete({
            where: { id },
        });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ message: 'Interal Server Error' });
    }
}

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};