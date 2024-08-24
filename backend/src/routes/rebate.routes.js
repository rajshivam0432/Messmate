import express from 'express';
import  Rebate  from '../models/rebate.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log("itsme",req.body);
    const rebates = await Rebate.find();
    res.json(rebates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
    try {
        console.log("kunal",req.body);
        const { user, reason, dateFrom, dateTo } = req.body;
        if (!user || !reason || !dateFrom || !dateTo) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new Rebate instance and save it to the database
        const newRebate = new Rebate({ user, reason, dateFrom, dateTo });
        await newRebate.save();
        res.status(201).json(newRebate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;