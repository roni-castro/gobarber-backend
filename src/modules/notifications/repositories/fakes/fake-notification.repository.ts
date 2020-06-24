import { ObjectID } from 'mongodb';

import ICreateNotificationDTO from '@modules/notifications/dtos/create-notification.dto';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationRepository from '@modules/notifications/repositories/i-notification.repository';

export default class FakeNotificationRepository
  implements INotificationRepository {
  private notifications: Notification[] = [];

  async create(data: ICreateNotificationDTO) {
    const notification = new Notification();
    Object.assign(notification, {
      id: new ObjectID(),
      ...data,
    });
    this.notifications.push(notification);
    return notification;
  }
}
