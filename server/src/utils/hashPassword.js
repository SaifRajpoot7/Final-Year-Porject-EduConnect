import bcryptjs from 'bcryptjs';
const generateHashPassword = async (password) => {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcryptjs.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Hashing failed');
    }
}


const verifyPassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcryptjs.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing password:', error);
        throw new Error('Comparison failed');
    }
}

const hashPasswordUtils = {
    generateHashPassword,
    verifyPassword
};

export default hashPasswordUtils;