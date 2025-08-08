const Userservice = require('../services/userService');
const jwt = require('jsonwebtoken');


//Generate JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

//@desc Register a new user
//@route POST /api/users/register
//@access Public
const registerUser = async (req, res) => {

    try {
        const { name, email, password, role } = req.body;
        //create user
        const user = await Userservice.createUser({ name, email, password, role });

        const token = generateToken(user);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//@desc Login user
//@route POST /api/users/login
//@access Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //find user by email
        const user = await Userservice.getUserByEmail(email);
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//@desc Get all users
//@route GET /api/users
//@access Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const users = await Userservice.getAllUsers(page, limit);
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
};
