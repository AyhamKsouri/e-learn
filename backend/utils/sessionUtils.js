const crypto = require('crypto');

// Generate unique session ID
const generateSessionId = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Extract device info from user agent
const getDeviceInfo = (userAgent) => {
    if (!userAgent) return 'Unknown Device';
    
    // Simple device detection
    if (userAgent.includes('Mobile') || userAgent.includes('Android')) {
        return 'Mobile Device';
    }
    if (userAgent.includes('iPad')) {
        return 'iPad';
    }
    if (userAgent.includes('iPhone')) {
        return 'iPhone';
    }
    if (userAgent.includes('Macintosh')) {
        return 'Mac';
    }
    if (userAgent.includes('Windows')) {
        return 'Windows PC';
    }
    if (userAgent.includes('Linux')) {
        return 'Linux';
    }
    return 'Desktop';
};

// Get browser info
const getBrowserInfo = (userAgent) => {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
};

// Create session object
const createSessionInfo = (req) => {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    
    return {
        sessionId: generateSessionId(),
        deviceInfo: `${getDeviceInfo(userAgent)} • ${getBrowserInfo(userAgent)}`,
        ipAddress: ipAddress,
        lastActive: new Date(),
        createdAt: new Date(),
    };
};

// Clean up expired sessions (older than 30 days)
const cleanupExpiredSessions = (sessions) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return sessions.filter(session => 
        session.lastActive && session.lastActive > thirtyDaysAgo
    );
};

module.exports = {
    generateSessionId,
    getDeviceInfo,
    getBrowserInfo,
    createSessionInfo,
    cleanupExpiredSessions,
};
