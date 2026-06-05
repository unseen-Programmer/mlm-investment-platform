import dotenv from 'dotenv';
import { fileURLToPath, URL } from 'node:url';
import app from './app.js';
import connectDB from './config/db.js';
import { startROICron } from './cron/roiCron.js';

dotenv.config({ path: fileURLToPath(new URL('.env', import.meta.url)) });

const PORT = process.env.PORT || 5000;

await connectDB();
startROICron();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
