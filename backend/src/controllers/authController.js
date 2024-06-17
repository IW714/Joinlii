const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const {email, password} = req.body;
    console.log('handleLogin called with:', {email, password}); // Debugging log

    if (!email || !password) {
        return res.status(400).json({success: false, message: 'Email and password are required.'});
    }; 

    try {
        const user = await prisma.user.findFirst({
            where: {email: email},
        });

        if (!user) {
            return res.status(404).json({success: false, message: 'User not found.'});
        };

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({success: false, message: 'Incorrect password.'});
        };

        // TODO: create JWTs
        res.json({success: true, message: 'Login successful.', user: user});
    } catch (err) {
        console.error('Error logging in:', err); // Debugging log
        res.status(500).json({success: false, message: err.message});
    };
};

module.exports = {handleLogin};