import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// User register
export const register = async (req, res) => {
   try {
      // Hashing password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const newUser = new User({
         username: req.body.username,
         email: req.body.email,
         password: hash,
         fullname: req.body.fullname,
         address: req.body.address,
         phone: req.body.phone,
         avatar: req.body.avatar,
         // role: req.body.role || 'user', // Default role to 'user' if not provided
      });

      await newUser.save();

      res.status(200).json({ success: true, message: "Successfully created!" });
   } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create! Try again." });
   }
};

// User login
export const login = async (req, res) => {
   try {
      const email = req.body.email;
      const user = await User.findOne({ email });

      // If user doesn't exist
      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found!' });
      }

      // Check if the password is correct
      const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password);

      // If password is incorrect
      if (!checkCorrectPassword) {
         return res.status(401).json({ success: false, message: "Incorrect email or password!" });
      }

      const { password, role, ...rest } = user._doc;

      // Create JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" });

      // Set token in the browser cookies and send the response to the client
      res.cookie('accessToken', token, {
         httpOnly: true,
         expires: token.expiresIn,
      }).status(200).json({ token, data: { ...rest }, role });
   } catch (error) {
      res.status(500).json({ success: false, message: "Failed to login: " + error.message });
   }
};

// Reset password
export const resetPassword = async (req, res) => {
   try {
      const { email, newPassword } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });

      // If user doesn't exist
      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found!' });
      }

      // Hash the new password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);

      // Update the user's password
      user.password = hash;
      await user.save();

      res.status(200).json({ success: true, message: "Password reset successful!" });
   } catch (error) {
      res.status(500).json({ success: false, message: "Failed to reset password. Please try again." });
   }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
   try {
      const { userId } = req.params;
      const { username, email, fullname, address, phone, avatar } = req.body;

      // Find the user by ID
      const user = await User.findById(userId);

      // If user doesn't exist
      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found!' });
      }

      // Update the user's profile
      user.username = username || user.username;
      user.email = email || user.email;
      user.fullname = fullname || user.fullname;
      user.address = address || user.address;
      user.phone = phone || user.phone;
      user.avatar = avatar || user.avatar;

      await user.save();

      res.status(200).json({ success: true, message: "Profile updated successfully!", data: user });
   } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update profile. Please try again." });
   }
};

//changePassword 
export const changePassword = async (req, res) => {
   const { id } = req.params;
   const { currentPassword, newPassword } = req.body;

   try {
      const user = await User.findById(id);
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
         return res.status(400).json({ message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.status(200).json({ message: 'Password changed successfully' });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};