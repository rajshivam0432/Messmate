import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    balance: Number,
    month: Number,
    year: Number,
    daysAttended: Number,
    dietCharges: Number,
    miscellaneousCharges: Number,
    extraCharges: Number,
    rebateAmount: Number,
    adjustedMealCost: Number
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
