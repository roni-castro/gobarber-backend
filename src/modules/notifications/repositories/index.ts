import { container } from 'tsyringe';
import NotificationRepository from '../infra/typeorm/repositories/notification.repository';
import INotificationRepository from './i-notification.repository';

container.registerSingleton<INotificationRepository>(
  'NotificationRepository',
  NotificationRepository
);
