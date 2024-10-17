import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import { sendOTP } from "../utils/sendOTP.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (_id, email) => {
  return jwt.sign({ _id, email }, process.env.SECRET, {
    expiresIn: "365d",
  });
};

const verifyOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  console.log("verifying", otp, req);

  const authHeader = req.headers.authorization;

  // Check if the authorization header is present
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Authorization header missing", success: false });
  }

  // Extract the token after 'Bearer'
  const token = authHeader.split(" ")[1];

  // Check if the token was extracted properly
  if (!token) {
    return res
      .status(401)
      .json({ message: "Token not provided", success: false });
  }

  // Verify the token
  const decoded = jwt.verify(token, process.env.SECRET);

  // Check if the token was verified and contains a user ID
  if (!decoded || !decoded._id) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }

  // Find the user by ID
  const user = await User.findById(decoded._id);
  console.log("verifying", otp, user.otp);

  if (!user) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  if (user.otp === otp) {
    user.isverified = true;
    user.otp = null; // Clear OTP after verification
    await user.save();

    const token = createToken(user._id, user.email);
    return res.status(200).json({
      success: true,
      message: "User verified successfully",
      token,
    });
  } else {
    return res.status(400).json({ message: "Invalid OTP", success: false });
  }
});

const sendOTPcon = asyncHandler(async (req, res) => {
  try {
    // console.log("req",req)
    const authHeader = req.headers.authorization;

    // Check if the authorization header is present
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header missing", success: false });
    }

    // Extract the token after 'Bearer'
    const token = authHeader.split(" ")[1];

    // Check if the token was extracted properly
    if (!token) {
      return res
        .status(401)
        .json({ message: "Token not provided", success: false });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET);

    // Check if the token was verified and contains a user ID
    if (!decoded || !decoded._id) {
      return res.status(401).json({ message: "Invalid token", success: false });
    }

    // Find the user by ID
    const user = await User.findById(decoded._id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    if (user.otp) {
      return res
        .status(400)
        .json({ message: "OTP already sent and not expired", success: false });
    }

    // Generate and save OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Convert OTP to string
    user.otp = otpCode;
    await user.save();
    console.log("otptostring", otpCode);
    // Send OTP via email
    await sendOTP(user.email, otpCode);

    // Return success response
    return res.status(200).json({ message: "OTP sent", success: true });
  } catch (error) {
    console.error("Error in sendOTPcon:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    rollNumber,
    email,
    mobileNumber,
    hostelNumber,
    roomNumber,
    password,
  } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    fullName,
    email,
    rollNumber,
    mobileNumber,
    hostelNumber,
    roomNumber,
    password: hashedPassword,
  });

  const registeredUser = await newUser.save();

  const token = createToken(registeredUser._id, email);

  return res
    .status(201)
    .json({
      user: registeredUser,
      token,
      message: "User registered successfully",
    });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "User not found", success: false });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    const token = createToken(user._id, user.email);
    return res.status(200).json({
      user,
      token,
      message: "Login success",
      success: true,
    });
  } else {
    return res
      .status(401)
      .json({ message: "Invalid credentials", success: false });
  }
});

export { registerUser, loginUser, verifyOtp, sendOTPcon };
