const nodemailer = require('nodemailer');
const crypto = require('crypto');

class EmailService {
  constructor() {
    // Create transporter - configure based on your email provider
    this.transporter = nodemailer.createTransport({
      // Gmail configuration (you can change this to your preferred provider)
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App password for Gmail
      }
    });

    // For development/testing, you can use Ethereal Email
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
      this.setupEtherealEmail();
    }
  }

  async setupEtherealEmail() {
    try {
      // Generate test SMTP service account from ethereal.email
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });

      console.log('📧 Using Ethereal Email for development');
      console.log('📧 Ethereal credentials:', testAccount.user, testAccount.pass);
    } catch (error) {
      console.error('Failed to setup Ethereal email:', error);
    }
  }

  // Generate 6-digit verification code
  generateVerificationCode() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Generate secure token for email verification
  generateEmailToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Send 2FA verification code
  async send2FACode(email, code, userName = '') {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@eduflow.com',
      to: email,
      subject: '🔐 Your EduFlow Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; }
            .content { padding: 2rem; }
            .code-box { background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 1.5rem; text-align: center; margin: 1.5rem 0; }
            .code { font-size: 2rem; font-weight: bold; color: #495057; letter-spacing: 0.5rem; font-family: 'Courier New', monospace; }
            .footer { background-color: #f8f9fa; padding: 1rem; text-align: center; color: #6c757d; font-size: 0.875rem; }
            .security-note { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 1rem; margin: 1rem 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 EduFlow Security</h1>
              <p>Two-Factor Authentication</p>
            </div>
            <div class="content">
              <h2>Hello ${userName || 'there'}! 👋</h2>
              <p>We received a request to sign in to your EduFlow account. To complete the login process, please use the verification code below:</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
                <p style="margin: 0.5rem 0 0 0; color: #6c757d;">Enter this code in your browser</p>
              </div>

              <div class="security-note">
                <strong>🛡️ Security Note:</strong>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                  <li>This code expires in 10 minutes</li>
                  <li>Never share this code with anyone</li>
                  <li>EduFlow will never ask for this code via phone or email</li>
                </ul>
              </div>

              <p><strong>If you didn't request this code,</strong> please ignore this email or contact our support team if you're concerned about your account security.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EduFlow. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await this.transporter.sendMail(mailOptions);
    
    // Log preview URL for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 2FA Code email sent:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  }

  // Send welcome email
  async sendWelcomeEmail(email, userName) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'welcome@eduflow.com',
      to: email,
      subject: '🎉 Welcome to EduFlow!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; }
            .content { padding: 2rem; }
            .cta-button { display: inline-block; background-color: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 1rem 0; }
            .footer { background-color: #f8f9fa; padding: 1rem; text-align: center; color: #6c757d; font-size: 0.875rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Welcome to EduFlow!</h1>
              <p>Your learning journey starts here</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}! 👋</h2>
              <p>We're excited to have you join the EduFlow community! You're now part of a platform that connects passionate learners with expert instructors.</p>
              
              <h3>🚀 What's next?</h3>
              <ul>
                <li>📚 Browse our extensive course catalog</li>
                <li>🎯 Set up your learning preferences</li>
                <li>🔒 Secure your account with two-factor authentication</li>
                <li>📈 Track your progress and achievements</li>
              </ul>

              <div style="text-align: center; margin: 2rem 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:8081'}/dashboard/student" class="cta-button">
                  Start Learning Now 🚀
                </a>
              </div>

              <p>If you have any questions, our support team is always here to help!</p>
              
              <p>Happy learning!<br><strong>The EduFlow Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EduFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await this.transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Welcome email sent:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  }

  // Send course notification
  async sendCourseNotification(email, userName, notificationType, courseData) {
    let subject, content;

    switch (notificationType) {
      case 'enrollment':
        subject = '🎉 Course Enrollment Confirmed';
        content = `
          <h2>Congratulations ${userName}! 🎊</h2>
          <p>You've successfully enrolled in <strong>${courseData.title}</strong>.</p>
          <p>📅 You can start learning immediately. The course includes:</p>
          <ul>
            <li>📚 ${courseData.lessons || 'Multiple'} lessons</li>
            <li>🎓 Certificate upon completion</li>
            <li>💬 Access to course community</li>
          </ul>
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${process.env.FRONTEND_URL}/course/${courseData.id}" class="cta-button">
              Start Learning 🚀
            </a>
          </div>
        `;
        break;
        
      case 'progress':
        subject = '📈 Great Progress on Your Course!';
        content = `
          <h2>Way to go, ${userName}! 🌟</h2>
          <p>You've made excellent progress on <strong>${courseData.title}</strong>.</p>
          <p>📊 Your progress: <strong>${courseData.progress}%</strong> complete</p>
          <p>Keep up the fantastic work! You're ${100 - courseData.progress}% away from completing this course.</p>
        `;
        break;
        
      case 'completion':
        subject = '🎊 Course Completed - Congratulations!';
        content = `
          <h2>Amazing work, ${userName}! 🏆</h2>
          <p>You've successfully completed <strong>${courseData.title}</strong>!</p>
          <p>🎓 Your certificate is now available in your dashboard.</p>
          <p>Ready for your next learning adventure? Check out our recommended courses!</p>
        `;
        break;
        
      default:
        subject = '📚 EduFlow Update';
        content = `<h2>Hello ${userName}!</h2><p>You have a new update on EduFlow.</p>`;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'notifications@eduflow.com',
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; }
            .content { padding: 2rem; }
            .cta-button { display: inline-block; background-color: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 1rem 0; }
            .footer { background-color: #f8f9fa; padding: 1rem; text-align: center; color: #6c757d; font-size: 0.875rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📚 EduFlow</h1>
            </div>
            <div class="content">
              ${content}
              <hr style="margin: 2rem 0; border: none; height: 1px; background-color: #dee2e6;">
              <p style="font-size: 0.875rem; color: #6c757d;">
                You received this email because you have email notifications enabled. 
                You can change your notification preferences in your 
                <a href="${process.env.FRONTEND_URL}/settings">account settings</a>.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EduFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await this.transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Course notification sent:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  }

  // Send password reset email
  async sendPasswordResetEmail(email, userName, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:8081'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'security@eduflow.com',
      to: email,
      subject: '🔒 Reset Your EduFlow Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 2rem; text-align: center; }
            .content { padding: 2rem; }
            .cta-button { display: inline-block; background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 1rem 0; }
            .security-note { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 1rem; margin: 1rem 0; }
            .footer { background-color: #f8f9fa; padding: 1rem; text-align: center; color: #6c757d; font-size: 0.875rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Password Reset</h1>
              <p>Secure your EduFlow account</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>We received a request to reset your EduFlow account password. Click the button below to reset it:</p>
              
              <div style="text-align: center; margin: 2rem 0;">
                <a href="${resetUrl}" class="cta-button">Reset My Password 🔑</a>
              </div>

              <div class="security-note">
                <strong>🛡️ Security Information:</strong>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                  <li>This link expires in 1 hour</li>
                  <li>Only use this link if you requested a password reset</li>
                  <li>If you didn't request this, please ignore this email</li>
                </ul>
              </div>

              <p>For security reasons, this link will expire in 1 hour. If you need to reset your password after that, you'll need to request a new reset link.</p>
              
              <p>If you're having trouble clicking the button, copy and paste this URL into your browser:<br>
              <code style="background-color: #f8f9fa; padding: 0.25rem; border-radius: 4px; word-break: break-all;">${resetUrl}</code></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EduFlow. All rights reserved.</p>
              <p>This is an automated security email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await this.transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Password reset email sent:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  }

  // Test email connection
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
