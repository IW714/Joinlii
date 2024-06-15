const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;
    console.log('handleNewUser called with:', { username, password }); // Debugging log

    if (!username || !password) {
        console.log('Username and Password are required.'); // Debugging log
        return res.json({ success: false, message: 'Username and Password are required.' });
    }

    try {
        // Check for duplicate usernames in db
        const duplicate = await prisma.user.findUnique({
            where: { username: username },
        });
        if (duplicate) {
            console.log('Duplicate username found:', username); // Debugging log
            return res.sendStatus(409); // 409 Conflict
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store the new user
        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
            },
        });

        console.log('User created successfully:', newUser); // Debugging log
        res.status(201).json({ success: true, message: 'User created successfully.' });
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

module.exports = { getAllUsers, handleNewUser };
