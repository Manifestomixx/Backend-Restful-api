const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Missing or invalid authorization header');
        return res.status(401).json({ success: false, message: 'You are not authorized to access this route' });
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log('JWT Payload:', payload);
        req.user = { userId: payload.userId, userName: payload.userName };
        next();
    } catch (error) {
        console.log('JWT verification failed:', error.message);
        return res.status(401).json({ success: false, message: "Authentication failed" });
    }
};

module.exports = auth;

