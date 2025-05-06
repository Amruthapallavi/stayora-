// src/utils/cron.ts
import cron from 'node-cron';
import container from '../config/DI/inversify';
import TYPES from '../config/DI/types';
import { IUserService } from '../services/interfaces/IUserService';

const userService = container.get<IUserService>(TYPES.UserService);

cron.schedule('0 0 * * *', async () => {
  console.log('Running cron job to update booking and property status...');
  try {
    await userService.updateBookingAndPropertyStatus();
  } catch (error) {
    console.error('Cron job failed:', error);
  }
});
