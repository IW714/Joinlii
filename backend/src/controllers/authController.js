const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const {email, password} = req.body;
    console.log('handleLogin called with:', {email, password}); // Debugging log

    if (!email || !password) {
        return res.status(400).json({success: false, message: 'Email and password are required.'});
    }; 

    try {
        const foundUser = await prisma.user.findFirst({
            where: {email: email},
        });

        if (!foundUser) {
            return res.status(404).json({success: false, message: 'User not found.'});
        };

        const passwordMatch = await bcrypt.compare(password, foundUser.password);

        if (!passwordMatch) {
            return res.status(401).json({success: false, message: 'Incorrect password.'});
        };

        // create JWTs
        const accessToken = jwt.sign(
            {userId: foundUser.id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            {userId: foundUser.id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );
        const OtherUsers = await prisma.user.filter((user) => user.id !== foundUser.id);
        const currUser = {...foundUser, refreshToken};

        prisma.user.update([...OtherUsers, currUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', `users.json`),
            JSON.stringify(prisma.user)
        );

        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
        res.json({accessToken});
    } catch (err) {
        console.error('Error logging in:', err); // Debugging log
        res.status(500).json({success: false, message: err.message});
    };
};

// const handleLogout = (req, res) => {

// };

module.exports = {handleLogin};