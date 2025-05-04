import cron from 'node-cron';
import userService from '../services/user.service';

cron.schedule('0 0 * * *', async () => {
  console.log('Running cron job to update booking and property status...');
  await userService.updateBookingAndPropertyStatus();
});
