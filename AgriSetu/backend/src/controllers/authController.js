const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/database');
const { generateToken, generateRefreshToken } = require('../config/jwt');
const { sendEmail } = require('../utils/email');

// Generate order number
const generateOrderNumber = () => {
  return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Register new user
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      farmName,
      farmDescription,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country = 'India'
    } = req.body;

    if (role === 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin accounts cannot be created through registration'
      });
    }

    // Check if user already exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Prepare user data
    const userData = {
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone,
      role,
      verification_token: verificationToken,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state,
      postal_code: postalCode,
      country
    };

    // Add farmer-specific fields if role is farmer
    if (role === 'farmer') {
      userData.farm_name = farmName;
      userData.farm_description = farmDescription;
      userData.farm_address = addressLine1;
    }

    // Insert user (support MySQL and Postgres)
    const insertRes = await db('users').insert(userData);
    const userId = Array.isArray(insertRes)
      ? (typeof insertRes[0] === 'object' ? insertRes[0].id : insertRes[0])
      : insertRes;

    // Generate tokens
    const token = generateToken({ userId, email, role });
    const refreshToken = generateRefreshToken({ userId });

    // Update refresh token in database
    await db('users').where({ id: userId }).update({ refresh_token: refreshToken });

    // Send verification email (optional - won't fail registration if email is not configured)
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      await sendEmail({
        to: email,
        subject: 'Verify your Agri-Setu account',
        template: 'verification',
        data: {
          name: firstName,
          verificationUrl
        }
      });
      console.log('Verification email sent successfully');
    } catch (emailError) {
      console.log('Email sending failed, but registration continues:', emailError.message);
      // Don't fail registration if email sending fails
    }

    // Get user data for response
    const user = await db('users')
      .select('id', 'email', 'first_name', 'last_name', 'phone', 'role', 'is_verified', 'created_at')
      .where({ id: userId })
      .first();

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully. Please verify your email.',
      data: {
        user,
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await db('users')
      .select('*')
      .where({ email })
      .first();

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Generate tokens
    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    // Update refresh token and last login
    await db('users')
      .where({ id: user.id })
      .update({ 
        refresh_token: refreshToken,
        updated_at: db.fn.now()
      });

    // Remove sensitive data
    const { password_hash, refresh_token, verification_token, ...userData } = user;

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: userData,
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: error.message
    });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token is required'
      });
    }

    // Find user with refresh token
    const user = await db('users')
      .select('id', 'email', 'role', 'is_active')
      .where({ refresh_token: refreshToken })
      .first();

    if (!user || !user.is_active) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newToken = generateToken({ userId: user.id, email: user.email, role: user.role });
    const newRefreshToken = generateRefreshToken({ userId: user.id });

    // Update refresh token
    await db('users')
      .where({ id: user.id })
      .update({ refresh_token: newRefreshToken });

    res.json({
      status: 'success',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Token refresh failed',
      error: error.message
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Clear refresh token
    await db('users')
      .where({ id: userId })
      .update({ refresh_token: null });

    res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Logout failed',
      error: error.message
    });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await db('users')
      .where({ verification_token: token })
      .first();

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid verification token'
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already verified'
      });
    }

    // Update user as verified
    await db('users')
      .where({ id: user.id })
      .update({ 
        is_verified: true,
        verification_token: null
      });

    res.json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Email verification failed',
      error: error.message
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await db('users')
      .where({ email })
      .first();

    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        status: 'success',
        message: 'If the email exists, a reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with reset token
    await db('users')
      .where({ id: user.id })
      .update({
        reset_password_token: resetToken,
        reset_password_expires: resetExpires
      });

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: email,
      subject: 'Reset your Agri-Setu password',
      template: 'password-reset',
      data: {
        name: user.first_name,
        resetUrl
      }
    });

    res.json({
      status: 'success',
      message: 'If the email exists, a reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Password reset request failed',
      error: error.message
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await db('users')
      .where({ reset_password_token: token })
      .where('reset_password_expires', '>', new Date())
      .first();

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    await db('users')
      .where({ id: user.id })
      .update({
        password_hash: passwordHash,
        reset_password_token: null,
        reset_password_expires: null
      });

    res.json({
      status: 'success',
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Password reset failed',
      error: error.message
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db('users')
      .select('*')
      .where({ id: userId })
      .first();

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Remove sensitive data
    const { password_hash, refresh_token, verification_token, reset_password_token, ...userData } = user;

    res.json({
      status: 'success',
      data: { user: userData }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile
};
