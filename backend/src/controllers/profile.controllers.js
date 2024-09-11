import jwt from 'jsonwebtoken';
import { Apierror } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Complaint } from "../models/complaint.model.js";

import express from 'express';
// import asyncHandler from 'express-async-handler';
// import jwt from 'jsonwebtoken';
// import User from '../models/User'; // Adjust the path to your User model
// import Complaint from '../models/Complaint'; // Adjust the path to your Complaint model
// import Apierror/ from '../utils/Apierror'; // Adjust the path to your Apierror utility
import upload from '../middleware/multerConfig'; // Adjust the path to your multerConfig file

const router = express.Router();

// Route to handle complaint submission with file upload
router.post('/api/v1/profile/complaint', upload.single('file'), asyncHandler(async (req, res) => {
  const { category, complaint } = req.body;
  const file = req.file; // The uploaded file

  // Validate input
  if (!category || !complaint) {
    throw new Apierror(400, "All fields are required");
  }

  // Verify and decode JWT token
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    throw new Apierror(401, "Unauthorized: Missing token");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    throw new Apierror(401, "Unauthorized: Invalid token");
  }

  // Extract user ID from decoded token
  const userId = decodedToken._id;

  // Find the logged-in user
  const complainter = await User.findById(userId);
  if (!complainter) {
    throw new Apierror(404, "User not found");
  }

  // Create a new complaint
  const createdComplaint = await Complaint.create({
    category,
    complaint,
    complainter: complainter._id,
    email: complainter.email,
    hostelNumber: complainter.hostelNumber,
    resolved: false,
    file: file ? file.path : null, // Store file path if file is uploaded
  });

  if (!createdComplaint) {
    throw new Apierror(500, "Failed to register the complaint");
  }

  // Send response
  return res.status(201).json({
    status: "success",
    data: createdComplaint,
    email: complainter.email,
    message: "Your complaint was registered successfully",
  });
}));

export default router;


export { complaint };
