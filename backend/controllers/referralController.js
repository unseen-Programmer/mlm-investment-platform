import User from '../models/User.js';

const buildTree = async (user) => {
  const children = await User.find({ referredBy: user._id })
    .select('name email referralCode walletBalance createdAt')
    .sort({ createdAt: 1 })
    .lean();

  const childNodes = await Promise.all(children.map((child) => buildTree(child)));

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    referralCode: user.referralCode,
    walletBalance: user.walletBalance,
    children: childNodes
  };
};

export const getReferralTree = async (req, res, next) => {
  try {
    const root = await User.findById(req.user._id)
      .select('name email referralCode walletBalance')
      .lean();

    const tree = await buildTree(root);

    return res.json({ tree });
  } catch (error) {
    return next(error);
  }
};
