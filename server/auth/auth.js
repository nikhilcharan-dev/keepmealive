import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'session expired' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);  // adding user creds
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
