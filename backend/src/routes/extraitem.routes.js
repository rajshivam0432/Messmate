const express = require('express');
const router = express.Router();
const ExtraItem = require('../models/ExtraItem');

// POST extra items for a specific date
router.post('/', async (req, res) => {
    try {
        const newExtraItem = new ExtraItem(req.body);
        const savedItem = await newExtraItem.save();
        res.json(savedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
