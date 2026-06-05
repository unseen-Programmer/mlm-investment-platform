import express from 'express';
import { getReferralTree } from '../controllers/referralController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/tree', protect, getReferralTree);

export default router;
