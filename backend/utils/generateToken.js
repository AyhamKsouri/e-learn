const jwt = require('jsonwebtoken');

const generateToken = (id, sessionId = null) => {
    const payload = { id };
    if (sessionId) {
        payload.sessionId = sessionId;
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = generateToken;
