import mongoose from 'mongoose';

const referralIncomeSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    level: {
      type: Number,
      required: true,
      enum: [1, 2, 3]
    },
    income: {
      type: Number,
      required: true,
      min: 0
    },
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

referralIncomeSchema.index({ fromUser: 1, toUser: 1, investment: 1, level: 1 }, { unique: true });

const ReferralIncome = mongoose.model('ReferralIncome', referralIncomeSchema);

export default ReferralIncome;
