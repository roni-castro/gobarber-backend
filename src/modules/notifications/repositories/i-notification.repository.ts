import ICreateNotificationDTO from '../dtos/create-notification.dto';
import Notification from '../infra/typeorm/schemas/Notification';

export default interface INotificationRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
}
