const nodemailer = require('nodemailer');

let cachedTransporter = null;

function getTransporter() {
    if (cachedTransporter) return cachedTransporter;

    const {
        SMTP_HOST,
        SMTP_PORT,
        SMTP_USER,
        SMTP_PASS,
        SMTP_SECURE,
        EMAIL_FROM
    } = process.env;

    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
        cachedTransporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: String(SMTP_SECURE || '').toLowerCase() === 'true',
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });
    } else {
        // Fallback to a no-op transport if not configured to avoid crashes in dev
        cachedTransporter = {
            sendMail: async (options) => {
                // eslint-disable-next-line no-console
                console.log('[emailService] Email transport not configured. Pretending to send:', {
                    to: options.to,
                    subject: options.subject,
                });
                return { messageId: 'dev-noop', accepted: [options.to] };
            }
        };
    }

    return cachedTransporter;
}

async function sendEmail({ to, subject, html, text, from }) {
    if (!to || !subject || (!html && !text)) {
        throw new Error('Missing required email fields: to, subject, and html or text');
    }

    const transporter = getTransporter();
    const info = await transporter.sendMail({
        from: from || process.env.EMAIL_FROM || 'no-reply@example.com',
        to,
        subject,
        text,
        html,
    });

    return info;
}

async function sendVerificationEmail({ to, verificationLink, appName = 'E-Learning App' }) {
    const subject = `${appName} - Verify your email`;
    const html = `
        <p>Hello,</p>
        <p>Thanks for signing up to ${appName}. Please verify your email by clicking the link below:</p>
        <p><a href="${verificationLink}">Verify Email</a></p>
        <p>If you did not request this, you can ignore this message.</p>
    `;

    return sendEmail({ to, subject, html });
}

async function sendPasswordResetEmail({ to, resetLink, appName = 'E-Learning App' }) {
    const subject = `${appName} - Reset your password`;
    const html = `
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the link below to proceed:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
    `;

    return sendEmail({ to, subject, html });
}

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
};