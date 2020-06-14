import IEmailProvider from '../models/IEmailProvider';
import ISendEmailDTO from '../dtos/send-email.dto';

export default class FakeEmailProvider implements IEmailProvider {
  private messages: ISendEmailDTO[] = [];

  public async sendEmail(message: ISendEmailDTO) {
    this.messages.push(message);
  }
}
