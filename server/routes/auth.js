import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken, generateTokens } from '../middleware/auth.js';

const router = express.Router();

// Register endpoint
router.post('/register', [
  body('username').isLength({ min: 3, max: 30 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate verification token and OTP
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user with email verification fields
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash, verification_token, verification_token_expires, verification_otp, verification_otp_expires) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, email, created_at',
      [username, email, passwordHash, verificationToken, verificationExpires, verificationOTP, verificationExpires]
    );

    const user = newUser.rows[0];

    // Send verification email
    await sendVerificationEmail(user, verificationToken, verificationOTP);

    res.status(201).json({
      message: 'User created successfully. Please check your email to verify your account.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
        emailVerified: false
      },
      requiresVerification: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Email verification helper function
async function sendVerificationEmail(user, verificationToken, verificationOTP) {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@mytodo.com',
    to: user.email,
    subject: 'Verify Your Email - MyTodo',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Welcome to MyTodo!</h2>
        <p>Hello ${user.username},</p>
        <p>Thank you for signing up for MyTodo. Please verify your email address to complete your registration.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Option 1: Click the verification link</h3>
          <p style="text-align: center;">
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Option 2: Enter this verification code</h3>
          <p style="text-align: center; font-size: 24px; font-weight: bold; color: #4CAF50; letter-spacing: 3px;">${verificationOTP}</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">This verification link and code will expire in 24 hours.</p>
        <p style="color: #666; font-size: 14px;">If you didn't create an account with MyTodo, please ignore this email.</p>
        
        <p>Best regards,<br>MyTodo Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

// Verify email with token endpoint
router.post('/verify-email', [
  body('token').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { token } = req.body;

    // Find user with valid verification token
    const userResult = await pool.query(
      'SELECT id, username, email, email_verified FROM users WHERE verification_token = $1 AND verification_token_expires > $2',
      [token, new Date()]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    const user = userResult.rows[0];

    if (user.email_verified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Mark email as verified and clear verification tokens
    await pool.query(
      'UPDATE users SET email_verified = TRUE, verification_token = NULL, verification_token_expires = NULL, verification_otp = NULL, verification_otp_expires = NULL WHERE id = $1',
      [user.id]
    );

    const tokens = generateTokens(user.id);

    res.json({
      message: 'Email verified successfully! You can now use all features of MyTodo.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: true
      },
      ...tokens
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify email with OTP endpoint
router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, otp } = req.body;

    // Find user with valid OTP
    const userResult = await pool.query(
      'SELECT id, username, email, email_verified FROM users WHERE email = $1 AND verification_otp = $2 AND verification_otp_expires > $3',
      [email, otp, new Date()]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const user = userResult.rows[0];

    if (user.email_verified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Mark email as verified and clear verification tokens
    await pool.query(
      'UPDATE users SET email_verified = TRUE, verification_token = NULL, verification_token_expires = NULL, verification_otp = NULL, verification_otp_expires = NULL WHERE id = $1',
      [user.id]
    );

    const tokens = generateTokens(user.id);

    res.json({
      message: 'Email verified successfully! You can now use all features of MyTodo.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: true
      },
      ...tokens
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resend verification email endpoint
router.post('/resend-verification', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email } = req.body;

    // Find user
    const userResult = await pool.query(
      'SELECT id, username, email, email_verified FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.json({ 
        message: 'If an account with that email exists and is unverified, we have sent you a new verification email.' 
      });
    }

    const user = userResult.rows[0];

    if (user.email_verified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate new verification token and OTP
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update verification tokens
    await pool.query(
      'UPDATE users SET verification_token = $1, verification_token_expires = $2, verification_otp = $3, verification_otp_expires = $4 WHERE id = $5',
      [verificationToken, verificationExpires, verificationOTP, verificationExpires, user.id]
    );

    // Send verification email
    await sendVerificationEmail(user, verificationToken, verificationOTP);

    res.json({ 
      message: 'Verification email sent successfully. Please check your email.' 
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const userResult = await pool.query(
      'SELECT id, username, email, password_hash, email_verified FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(403).json({ 
        error: 'Email not verified. Please verify your email before logging in.',
        requiresVerification: true,
        email: user.email
      });
    }

    const tokens = generateTokens(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.email_verified
      },
      ...tokens
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Verify user exists
    const userResult = await pool.query(
      'SELECT id, username, email, email_verified FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const tokens = generateTokens(decoded.userId);

    res.json({
      message: 'Token refreshed successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.email_verified
      },
      ...tokens
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    console.error('Token refresh error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id, username, email, email_verified FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.email_verified
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Forgot password endpoint
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email } = req.body;

    // Check if user exists
    const userResult = await pool.query(
      'SELECT id, username, email FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists or not for security
      return res.json({ 
        message: 'If an account with that email exists, we have sent you a password reset link.' 
      });
    }

    const user = userResult.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
      [resetToken, resetTokenExpires, user.id]
    );

    // Send reset email
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@mytodo.com',
      to: email,
      subject: 'Password Reset Request - MyTodo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.username},</p>
          <p>You requested to reset your password for your MyTodo account.</p>
          <p>Please click the link below to reset your password:</p>
          <p><a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>MyTodo Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'If an account with that email exists, we have sent you a password reset link.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password endpoint
router.post('/reset-password', [
  body('token').notEmpty().trim(),
  body('password').isLength({ min: 6 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { token, password } = req.body;

    // Find user with valid reset token
    const userResult = await pool.query(
      'SELECT id, username, email FROM users WHERE reset_token = $1 AND reset_token_expires > $2',
      [token, new Date()]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const user = userResult.rows[0];

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [passwordHash, user.id]
    );

    res.json({ 
      message: 'Password has been successfully reset. You can now login with your new password.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password endpoint (for authenticated users)
router.post('/change-password', authenticateToken, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get current user password
    const userResult = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
    if (isSamePassword) {
      return res.status(400).json({ error: 'New password must be different from current password' });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [newPasswordHash, userId]
    );

    res.json({ 
      message: 'Password has been successfully changed' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete account endpoint
router.delete('/delete-account', authenticateToken, [
  body('password').notEmpty(),
  body('confirmDelete').equals('DELETE').withMessage('Please type "DELETE" to confirm account deletion')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { password, confirmDelete } = req.body;
    const userId = req.user.id;

    // Get current user password
    const userResult = await pool.query(
      'SELECT password_hash, username, email FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Begin transaction for account deletion
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Delete all user's tasks first (due to foreign key constraint)
      await client.query('DELETE FROM tasks WHERE user_id = $1', [userId]);

      // Delete the user account
      await client.query('DELETE FROM users WHERE id = $1', [userId]);

      await client.query('COMMIT');

      // Send account deletion confirmation email
      try {
        const mailOptions = {
          from: process.env.SMTP_FROM || 'noreply@mytodo.com',
          to: user.email,
          subject: 'Account Deleted - MyTodo',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; text-align: center;">Account Deleted Successfully</h2>
              <p>Hello ${user.username},</p>
              <p>Your MyTodo account has been successfully deleted as requested.</p>
              <p>All your data, including tasks and personal information, has been permanently removed from our servers.</p>
              <p>If you didn't request this deletion or believe this was done in error, please contact our support team immediately.</p>
              <p>Thank you for using MyTodo. We're sorry to see you go!</p>
              <p>Best regards,<br>MyTodo Team</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Failed to send account deletion email:', emailError);
        // Don't fail the deletion if email fails
      }

      res.json({ 
        message: 'Account deleted successfully. We\'re sorry to see you go!'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 