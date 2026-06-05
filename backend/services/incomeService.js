import Investment from '../models/Investment.js';
import ROIHistory from '../models/ROIHistory.js';
import ReferralIncome from '../models/ReferralIncome.js';
import User from '../models/User.js';

const LEVEL_RATES = {
  1: 0.1,
  2: 0.05,
  3: 0.02
};

export const normalizeDay = (date = new Date()) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
};

const endOfDay = (date = new Date()) => {
  const day = new Date(date);
  day.setHours(23, 59, 59, 999);
  return day;
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const generateReferralCode = () => {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MLM${random}`;
};

export const createUniqueReferralCode = async () => {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = generateReferralCode();
    const exists = await User.exists({ referralCode: code });
    if (!exists) return code;
  }

  throw new Error('Unable to generate a unique referral code');
};

export const distributeReferralIncome = async ({ investorId, investmentId, amount }) => {
  let currentUser = await User.findById(investorId);
  const createdRecords = [];

  for (let level = 1; level <= 3; level += 1) {
    if (!currentUser?.referredBy) break;

    const ancestor = await User.findById(currentUser.referredBy);
    if (!ancestor) break;

    const income = Number((amount * LEVEL_RATES[level]).toFixed(2));

    const record = await ReferralIncome.create({
      fromUser: investorId,
      toUser: ancestor._id,
      investment: investmentId,
      level,
      income
    });

    await User.updateOne(
      { _id: ancestor._id },
      { $inc: { walletBalance: income } }
    );

    createdRecords.push(record);
    currentUser = ancestor;
  }

  return createdRecords;
};

export const generateDailyROI = async (targetDate = new Date()) => {
  const roiDate = normalizeDay(targetDate);
  const roiDayEnd = endOfDay(targetDate);
  const activeInvestments = await Investment.find({
    status: 'ACTIVE',
    startDate: { $lte: roiDayEnd },
    endDate: { $gte: roiDate }
  }).select('_id user amount endDate status');

  const summary = {
    date: roiDate,
    checked: activeInvestments.length,
    created: 0,
    skipped: 0,
    completed: 0
  };

  for (const investment of activeInvestments) {
    try {
      const roiAmount = Number((investment.amount * 0.01).toFixed(2));

      const result = await ROIHistory.updateOne(
        { investment: investment._id, date: roiDate },
        {
          $setOnInsert: {
            user: investment.user,
            investment: investment._id,
            roiAmount,
            date: roiDate
          }
        },
        { upsert: true }
      );

      if (result.upsertedCount === 0) {
        summary.skipped += 1;
        continue;
      }

      await User.updateOne(
        { _id: investment.user },
        { $inc: { walletBalance: roiAmount } }
      );

      summary.created += 1;
    } catch (error) {
      if (error.code === 11000) {
        summary.skipped += 1;
        continue;
      }
      throw error;
    }
  }

  const completed = await Investment.updateMany(
    { status: 'ACTIVE', endDate: { $lt: roiDate } },
    { $set: { status: 'COMPLETED' } }
  );
  summary.completed = completed.modifiedCount;

  return summary;
};
