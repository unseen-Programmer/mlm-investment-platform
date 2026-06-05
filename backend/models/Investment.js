import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: [true, 'Investment amount is required'],
      min: [1, 'Investment amount must be greater than zero']
    },
    plan: {
      type: String,
      required: [true, 'Plan is required'],
      trim: true,
      enum: ['Silver', 'Gold', 'Platinum']
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED'],
      default: 'ACTIVE',
      index: true
    }
  },
  { timestamps: true }
);

const Investment = mongoose.model('Investment', investmentSchema);

export default Investment;
