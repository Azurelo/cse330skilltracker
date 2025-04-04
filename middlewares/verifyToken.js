const jwt = require('jsonwebtoken');

// Middleware to verify the token
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Ensure JWT_SECRET is in your .env file
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = verifyToken;
