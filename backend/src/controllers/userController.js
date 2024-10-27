const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log('handleNewUser called with:', { name, email, password }); // Debugging log

    if (!name || !email || !password) {
        console.log('Name, Email, and Password are required.'); // Debugging log
        return res.json({ success: false, message: 'Name, Email, and Password are required.' });
    }

    try {
        // Check for duplicate emails in db (optional, based on your business logic)
        const existingUser = await prisma.user.findFirst({
            where: { email: email },
        });

        if (existingUser) {
            console.log('Duplicate email found:', email); // Debugging log
            return res.status(409).json({ success: false, message: 'Email already exists.' });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store the new user
        const newUser = await prisma.user.create({
            data: {
                id: uuidv4(), // Generate unique id
                name: name,
                email: email,
                password: hashedPassword,
            },
        });

        console.log('User created successfully:', newUser); // Debugging log
        res.status(201).json({ success: true, message: 'User created successfully.', user: newUser });
    } catch (err) {
        console.error('Error creating user:', err); // Debugging log
        res.status(500).json({ success: false, message: err.message });
    }
};


const getAllUsers = async (req, res) => {
    console.log('getAllUsers called'); // Debugging log
    try {
        const users = await prisma.user.findMany();
        console.log('Users retrieved:', users); // Debugging log
        res.json(users);
    } catch (err) {
        console.error('Error retrieving users:', err); // Debugging log
        res.status(500).json({ success: false, message: err.message });
    }
};

const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error retrieving user:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, password } = req.body;

    console.log('Updating user:', { userId, name, password }); // Debugging log

    try {
        // Check if name or password is provided in the request body
        const dataToUpdate = {};
        if (name) {
            dataToUpdate.name = name;
        }
        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        console.log('Data to update:', dataToUpdate); // Debugging log

        // Update the user only with the fields provided in dataToUpdate
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate,
        });

        console.log('Updated user:', updatedUser); // Debugging log

        res.json({ success: true, message: 'User updated successfully.', user: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};


const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        await prisma.user.delete({
            where: { id: userId },
        });

        res.json({ success: true, message: 'User deleted successfully.' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const getUserProfile = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                preferences: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error retrieving user:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const updateUserProfile = async (req, res) => {
    const userId = req.userId;
    const { name, preferences } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: name, 
                preferences: preferences
            },
            select: {
                id: true,
                name: true,
                email: true,
                preferences: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = { getAllUsers, handleNewUser, getUserById, updateUser, deleteUser, getUserProfile, updateUserProfile };
