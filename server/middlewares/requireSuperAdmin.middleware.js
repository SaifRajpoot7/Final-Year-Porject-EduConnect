// Middleware to check if current user is super admin
const requireSuperAdmin = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({ success: false, message: 'Unauthorized: Missing token' });
        }


        
        if (user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: ' Access Forbidden: You are not Admin of this Platform' });
        }

        if (user.role === 'super_admin') {
        next();
        }
    } catch (error) {
        console.error('Super Admin Middleware Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export default requireSuperAdmin;
