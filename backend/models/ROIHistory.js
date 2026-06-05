import mongoose from 'mongoose';

const roiHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      required: true,
      index: true
    },
    roiAmount: {
      type: Number,
      required: true,
      min: 0
    },
    date: {
      type: Date,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

roiHistorySchema.index({ investment: 1, date: 1 }, { unique: true });

const ROIHistory = mongoose.model('ROIHistory', roiHistorySchema);

export default ROIHistory;
