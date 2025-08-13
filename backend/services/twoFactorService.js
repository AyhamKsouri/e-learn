const emailService = require('./emailService');

class TwoFactorService {
  constructor() {
    // In-memory store for verification codes (in production, use Redis or database)
    this.verificationCodes = new Map();
    this.codeExpiry = 10 * 60 * 1000; // 10 minutes in milliseconds
  }

  // Generate and store verification code
  async generateCode(userId, email, userName) {
    const code = emailService.generateVerificationCode();
    const expiresAt = Date.now() + this.codeExpiry;
    
    // Store code with user info
    this.verificationCodes.set(userId, {
      code,
      email,
      userName,
      expiresAt,
      attempts: 0,
      maxAttempts: 3
    });

    // Send email with verification code
    try {
      await emailService.send2FACode(email, code, userName);
      console.log(`📧 2FA code sent to ${email} for user ${userName}`);
      return { success: true, message: 'Verification code sent to your email' };
    } catch (error) {
      console.error('Failed to send 2FA code:', error);
      // Remove the code if email failed
      this.verificationCodes.delete(userId);
      throw new Error('Failed to send verification code. Please try again.');
    }
  }

  // Verify the code
  verifyCode(userId, inputCode) {
    const stored = this.verificationCodes.get(userId);
    
    if (!stored) {
      return { 
        success: false, 
        message: 'No verification code found. Please request a new one.' 
      };
    }

    // Check if code has expired
    if (Date.now() > stored.expiresAt) {
      this.verificationCodes.delete(userId);
      return { 
        success: false, 
        message: 'Verification code has expired. Please request a new one.' 
      };
    }

    // Check attempts limit
    if (stored.attempts >= stored.maxAttempts) {
      this.verificationCodes.delete(userId);
      return { 
        success: false, 
        message: 'Too many failed attempts. Please request a new verification code.' 
      };
    }

    // Verify the code
    if (stored.code === inputCode.toString().trim()) {
      this.verificationCodes.delete(userId);
      return { 
        success: true, 
        message: 'Verification successful!' 
      };
    } else {
      // Increment failed attempts
      stored.attempts++;
      this.verificationCodes.set(userId, stored);
      
      const remainingAttempts = stored.maxAttempts - stored.attempts;
      return { 
        success: false, 
        message: `Invalid verification code. ${remainingAttempts} attempts remaining.` 
      };
    }
  }

  // Check if user has a pending verification code
  hasPendingCode(userId) {
    const stored = this.verificationCodes.get(userId);
    if (!stored) return false;
    
    // Check if expired
    if (Date.now() > stored.expiresAt) {
      this.verificationCodes.delete(userId);
      return false;
    }
    
    return true;
  }

  // Get remaining time for code expiry
  getCodeTimeRemaining(userId) {
    const stored = this.verificationCodes.get(userId);
    if (!stored) return 0;
    
    const remaining = Math.max(0, stored.expiresAt - Date.now());
    return Math.ceil(remaining / 1000); // Return seconds
  }

  // Resend verification code (with rate limiting)
  async resendCode(userId, email, userName) {
    const stored = this.verificationCodes.get(userId);
    
    if (stored) {
      const timeSinceGenerated = Date.now() - (stored.expiresAt - this.codeExpiry);
      const minResendTime = 60 * 1000; // 1 minute minimum between resends
      
      if (timeSinceGenerated < minResendTime) {
        const waitTime = Math.ceil((minResendTime - timeSinceGenerated) / 1000);
        return { 
          success: false, 
          message: `Please wait ${waitTime} seconds before requesting a new code.` 
        };
      }
    }

    // Generate new code
    return await this.generateCode(userId, email, userName);
  }

  // Clean up expired codes (should be called periodically)
  cleanupExpiredCodes() {
    const now = Date.now();
    for (const [userId, data] of this.verificationCodes.entries()) {
      if (now > data.expiresAt) {
        this.verificationCodes.delete(userId);
      }
    }
  }

  // Get verification status for user
  getVerificationStatus(userId) {
    const stored = this.verificationCodes.get(userId);
    if (!stored) {
      return { 
        hasPendingCode: false 
      };
    }

    const isExpired = Date.now() > stored.expiresAt;
    if (isExpired) {
      this.verificationCodes.delete(userId);
      return { 
        hasPendingCode: false 
      };
    }

    return {
      hasPendingCode: true,
      timeRemaining: this.getCodeTimeRemaining(userId),
      attemptsUsed: stored.attempts,
      maxAttempts: stored.maxAttempts,
      email: stored.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email for security
    };
  }
}

// Clean up expired codes every 5 minutes
const twoFactorService = new TwoFactorService();
setInterval(() => {
  twoFactorService.cleanupExpiredCodes();
}, 5 * 60 * 1000);

module.exports = twoFactorService;
