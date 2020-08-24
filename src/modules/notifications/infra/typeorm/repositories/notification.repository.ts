import INotificationRepository from '@modules/notifications/repositories/i-notification.repository';
import { MongoRepository, getMongoRepository } from 'typeorm';
import ICreateNotificationDTO from '@modules/notifications/dtos/create-notification.dto';
import Notification from '../schemas/Notification';

export default class NotificationRepository implements INotificationRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  async create({ recipient_id, content }: ICreateNotificationDTO) {
    const notification = this.ormRepository.create({
      recipient_id,
      content,
    });
    await this.ormRepository.save(notification);
    return notification;
  }
}
