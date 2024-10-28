const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Authorization header missing.' });
    }

    console.log(authHeader); // bearer token

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token missing.' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          console.error('JWT verification failed:', err);
          return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
        }
    
        req.userId = decoded.userId; // Set userId from token
        next();
      });
}

module.exports = verifyJWT;