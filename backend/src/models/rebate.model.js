import mongoose from 'mongoose';

const rebateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ensure 'User' model is defined and exported correctly
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  dateFrom: {
    type: Date,
    required: true
  },
  dateTo: {
    type: Date,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Rebate', rebateSchema);
