import { Router } from "express";
// import { upload } from "../middlewares/multer.middlewares.js";
import { complaint} from "../controllers/profile.controllers.js";
import { Complaint } from "../models/complaint.model.js";
import { Apierror } from "../utils/apierror.js";
import jwt from 'jsonwebtoken';



const router=Router();




router.route('/complaint').post(complaint)   
router.route("/complaints").get(async (req, res) => {
  try {
    
    // Fetch complaints associated with the logged-in user
    const complaints = await Complaint.find({}).lean(); // Use lean() to convert to plain objects
    console.log("complaints",complaints)


    // Modify each complaint object to include useremail
   
    console.log("complaintsWithUserEmail",complaints)

    res.status(200).json({ data: complaints }); // Send response with modified complaints
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }})
  // Assuming you are using Express.js and Mongoose
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { resolved } = req.body;
    // console.log(resolved,id,req.params);

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { resolved },
      { new: true }
    );
    // console.log(resolved,id,complaint);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({ message: 'Complaint updated successfully', data: complaint });
  } catch (error) {
    console.error('Error updating complaint:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router