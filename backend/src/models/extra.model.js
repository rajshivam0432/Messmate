const mongoose = require('mongoose');

const ExtraItemSchema = new Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    items: [{ name: String, price: Number, quantity: Number }]
});

module.exports = mongoose.model('ExtraItem', ExtraItemSchema);