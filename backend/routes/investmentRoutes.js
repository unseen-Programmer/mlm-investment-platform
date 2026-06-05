import express from 'express';
import { createInvestment, getInvestments } from '../controllers/investmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getInvestments).post(createInvestment);

export default router;
