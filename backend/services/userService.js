const User = require('../models/User');

// Create a new user
const createUser = async (userData) => {
    try {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('User already exists with this email');
        }
        const user = new User(userData);
        return await user.save();
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};


// Get all users with pagination
const getAllUsers = async (page = 1, limit = 10) => {
    try {
        page = Math.max(1, parseInt(page));
        limit = Math.max(1, parseInt(limit));

        return await User.find()
            .skip((page - 1) * limit)
            .limit(limit);
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
};

// Get a user by email
const getUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw new Error(`Error fetching user by email: ${error.message}`);
    }
};


module.exports = {
    createUser,
    getAllUsers,
    getUserByEmail
};
