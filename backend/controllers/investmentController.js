import Investment from '../models/Investment.js';
import { addDays, distributeReferralIncome } from '../services/incomeService.js';

const PLAN_DURATIONS = {
  Silver: 180,
  Gold: 240,
  Platinum: 365
};

export const createInvestment = async (req, res, next) => {
  try {
    const { amount, plan } = req.body;
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    if (!PLAN_DURATIONS[plan]) {
      return res.status(400).json({ message: 'Plan must be Silver, Gold or Platinum' });
    }

    const startDate = new Date();
    const endDate = addDays(startDate, PLAN_DURATIONS[plan]);

    const investment = await Investment.create({
      user: req.user._id,
      amount: numericAmount,
      plan,
      startDate,
      endDate,
      status: 'ACTIVE'
    });

    await distributeReferralIncome({
      investorId: req.user._id,
      investmentId: investment._id,
      amount: numericAmount
    });

    const populated = await Investment.findById(investment._id).populate('user', 'name email');

    return res.status(201).json({
      message: 'Investment created successfully',
      investment: populated
    });
  } catch (error) {
    return next(error);
  }
};

export const getInvestments = async (req, res, next) => {
  try {
    const investments = await Investment.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ investments });
  } catch (error) {
    return next(error);
  }
};
