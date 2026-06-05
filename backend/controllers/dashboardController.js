import mongoose from 'mongoose';
import Investment from '../models/Investment.js';
import ROIHistory from '../models/ROIHistory.js';
import ReferralIncome from '../models/ReferralIncome.js';
import User from '../models/User.js';

const sumByUser = async (Model, userId, field, matchField = 'user') => {
  const [result] = await Model.aggregate([
    { $match: { [matchField]: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: `$${field}` } } }
  ]);

  return result?.total || 0;
};

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalInvestment, totalROI, totalLevelIncome, user, activeInvestments, recentROI] =
      await Promise.all([
        sumByUser(Investment, userId, 'amount'),
        sumByUser(ROIHistory, userId, 'roiAmount'),
        sumByUser(ReferralIncome, userId, 'income', 'toUser'),
        User.findById(userId).select('walletBalance referralCode name email'),
        Investment.find({ user: userId }).sort({ createdAt: -1 }).lean(),
        ROIHistory.aggregate([
          { $match: { user: new mongoose.Types.ObjectId(userId) } },
          {
            $group: {
              _id: '$date',
              roiAmount: { $sum: '$roiAmount' }
            }
          },
          { $sort: { _id: -1 } },
          { $limit: 30 },
          {
            $project: {
              _id: 0,
              date: '$_id',
              roiAmount: 1
            }
          },
          { $sort: { date: 1 } }
        ])
      ]);

    return res.json({
      totalInvestment,
      totalROI,
      totalLevelIncome,
      walletBalance: user.walletBalance,
      referralCode: user.referralCode,
      activeInvestments: activeInvestments.filter((item) => item.status === 'ACTIVE'),
      investments: activeInvestments,
      recentROI
    });
  } catch (error) {
    return next(error);
  }
};
