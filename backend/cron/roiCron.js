import cron from 'node-cron';
import { generateDailyROI } from '../services/incomeService.js';

export const startROICron = () => {
  if (process.env.ENABLE_CRON === 'false') {
    console.log('ROI cron disabled');
    return null;
  }

  const task = cron.schedule(
    '0 0 * * *',
    async () => {
      try {
        const summary = await generateDailyROI(new Date());
        console.log(
          `ROI cron complete for ${summary.date.toISOString()}: created=${summary.created}, skipped=${summary.skipped}, completed=${summary.completed}`
        );
      } catch (error) {
        console.error(`ROI cron failed: ${error.message}`);
      }
    },
    { timezone: 'Asia/Kolkata' }
  );

  console.log('ROI cron scheduled for midnight Asia/Kolkata');
  return task;
};
