const UserService = require('../services/userService');
const generateToken = require('../utils/generateToken');
const { createSessionInfo } = require('../utils/sessionUtils');
const emailService = require('../services/emailService');
const twoFactorService = require('../services/twoFactorService');

// Register teacher
const registerTeacher = async (req, res) => {
    try {
        const { name, email, password, bio } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Create teacher with role set to 'teacher'
        const teacherData = { 
            name, 
            email, 
            password, 
            role: 'teacher',
            bio: bio || ''
        };

        const teacher = await UserService.createUser(teacherData);

        // Send welcome email if email notifications are enabled
        if (teacher.preferences.emailNotifications) {
            try {
                await emailService.sendWelcomeEmail(teacher.email, teacher.name);
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
                // Don't fail registration if email fails
            }
        }

        // Create session for new teacher
        const sessionInfo = createSessionInfo(req);
        const sessionId = await UserService.addUserSession(teacher._id, sessionInfo);

        res.status(201).json({
            _id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            role: teacher.role,
            bio: teacher.bio,
            profileImage: teacher.profileImage,
            preferences: teacher.preferences,
            twoFactorEnabled: teacher.twoFactorEnabled,
            createdAt: teacher.createdAt,
            lastUpdated: teacher.lastUpdated,
            token: generateToken(teacher._id, sessionId),
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login teacher
const loginTeacher = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await UserService.getUserByEmail(email);
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if user is a teacher
        if (user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Teacher account required.' });
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
            // Generate and send 2FA code
            try {
                const result = await twoFactorService.generateCode(user._id, user.email, user.name);
                return res.json({
                    message: result.message,
                    requires2FA: true,
                    userId: user._id,
                    email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Masked email
                });
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        }

        // Create session for login (non-2FA users)
        const sessionInfo = createSessionInfo(req);
        const sessionId = await UserService.addUserSession(user._id, sessionInfo);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            profileImage: user.profileImage,
            preferences: user.preferences,
            twoFactorEnabled: user.twoFactorEnabled,
            createdAt: user.createdAt,
            lastUpdated: user.lastUpdated,
            token: generateToken(user._id, sessionId),
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get teacher profile
const getTeacherProfile = async (req, res) => {
    try {
        const teacher = await UserService.getUserById(req.user._id);
        
        res.json({
            _id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            role: teacher.role,
            bio: teacher.bio,
            profileImage: teacher.profileImage,
            preferences: teacher.preferences,
            twoFactorEnabled: teacher.twoFactorEnabled,
            activeSessions: teacher.activeSessions,
            createdAt: teacher.createdAt,
            lastUpdated: teacher.lastUpdated,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update teacher profile
const updateTeacherProfile = async (req, res) => {
    try {
        const { name, bio } = req.body;
        let profileImage = req.body.profileImage;
        
        // Handle file upload if present
        if (req.file) {
            // Convert buffer to base64
            profileImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }
        
        const updateData = { name, bio, profileImage };
        const teacher = await UserService.updateUserProfile(req.user._id, updateData);
        
        res.json({
            message: 'Teacher profile updated successfully',
            user: {
                _id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                role: teacher.role,
                bio: teacher.bio,
                profileImage: teacher.profileImage,
                preferences: teacher.preferences,
                twoFactorEnabled: teacher.twoFactorEnabled,
                lastUpdated: teacher.lastUpdated,
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    registerTeacher,
    loginTeacher,
    getTeacherProfile,
    updateTeacherProfile,
};
