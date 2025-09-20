const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/user");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const sendEmail = require("../utils/SendGridEmail");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const signup = async (req, res) => {
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   try {
//     const { name, email, password } = req.body;

//     const existingUser = await userModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         message: "User already exists",
//         success: false,
//       });
//     }
//     const result = await sendEmail(otp,email);

//     const hashedPassword = await bcrypt.hash(password, process.env.HASH);

//     const newUser = new userModel({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     const token = jwt.sign(
//       { id: newUser._id, email: newUser.email },
//       process.env.SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(201).json({
//       message: "User registered successfully",
//       success: true,
//       token,
//       user: { id: newUser._id, name: newUser.name, email: newUser.email },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server error",
//       success: false,
//     });
//   }
// };

const PendingUser = require("../Models/PendingUser");

const signup = async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const result = await sendEmail(otp, email);
    if (!result.success) {
      return res.status(404).json({
        message: "Email not found or failed to send",
        success: false,
      });
    }
    const salt = process.env.HASH || 10;
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    const hashedPassword = await bcrypt.hash(password, 10);
    await PendingUser.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: hashedPassword,
        otp: hashedOtp,
        otpExpires: Date.now() + 10 * 60 * 1000,
      },
      { upsert: true }
    );

    res.status(200).json({
      message: "OTP sent to email. Please verify to complete signup.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return res.status(404).json({
        message: "No pending signup found for this email",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(otp.toString(), pendingUser.otp);
    if (!isMatch || Date.now() > pendingUser.otpExpires) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
        success: false,
      });
    }

    const newUser = new userModel({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
    });
    await newUser.save();

    await PendingUser.deleteOne({ email });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Signup complete, user verified",
      success: true,
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: "User not found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// ✅ New Google Login
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body; // from frontend Google login
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Find or create user
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: "User not found",
        success: false,
      });
    }

    // Generate JWT same as normal login
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      message: "Invalid Google token",
      success: false,
    });
  }
};

// const verifyOtp = (req, res) => {};

module.exports = { signup, login, googleLogin, verifyOtp };
