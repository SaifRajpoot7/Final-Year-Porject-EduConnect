import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// const requireAuth = async (req, res, next) => {
//     try {
//         const token = req.cookies?.token;
//         // console.log('token', token)
//         if (!token) {
//             return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
//         }

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Find user and attach to request
//         const user = await User.findById(decoded.id).select('-password');
//         if (!user) {
//             return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.error('Auth Middleware Error:', error.message);
//         return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
//     }
// };

const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Missing token',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.id || decoded._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid token payload',
            });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User no longer exists',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.name, error.message);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }
};


export default requireAuth;