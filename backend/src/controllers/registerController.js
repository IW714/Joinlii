const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ success: false, message: 'Username and Password are required.' });
    }

    try {
        // Check for duplicate usernames in db
        const duplicate = await prisma.user.findUnique({
            where: { username: username },
        });
        if (duplicate) {
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

        res.status(201).json({ success: true, message: 'User created successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getAllUsers, handleNewUser };
