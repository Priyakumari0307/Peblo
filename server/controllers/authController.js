const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Note = require('../models/Note');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        jobTitle: user.jobTitle,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        jobTitle: user.jobTitle,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, ...userData } = user;
  res.status(200).json(userData);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, bio, jobTitle, avatar, currentPassword, newPassword } = req.body;

    // If changing password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const fullUser = await User.findByEmail(user.email);
      const isMatch = await bcrypt.compare(currentPassword, fullUser.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      const updatedUser = await User.update(req.user.id, { password: hashedNewPassword });
      const { password, ...safeData } = updatedUser;
      return res.json({
        _id: safeData.id,
        name: safeData.name,
        email: safeData.email,
        avatar: safeData.avatar,
        bio: safeData.bio,
        jobTitle: safeData.jobTitle,
        token: generateToken(safeData.id),
      });
    }

    // Check if new email is already taken by someone else
    if (email && email !== user.email) {
      const emailExists = await User.findByEmail(email);
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    // Build fields to update (map camelCase to snake_case for DB)
    const fields = {};
    if (name !== undefined) fields.name = name;
    if (email !== undefined) fields.email = email;
    if (bio !== undefined) fields.bio = bio;
    if (jobTitle !== undefined) fields.job_title = jobTitle;
    if (avatar !== undefined) fields.avatar = avatar;

    const updatedUser = await User.update(req.user.id, fields);

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      jobTitle: updatedUser.jobTitle,
      token: generateToken(updatedUser.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account and all their notes
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get full user with password for comparison
    const fullUser = await User.findByEmail(user.email);
    const isMatch = await bcrypt.compare(password, fullUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Delete all notes belonging to the user (cascade handles this, but explicit is safe)
    await Note.deleteByUserId(req.user.id);
    // Delete the user
    await User.deleteById(req.user.id);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  deleteAccount,
};

