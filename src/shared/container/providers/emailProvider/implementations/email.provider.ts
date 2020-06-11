import IEmailProvider from '../models/IEmailProvider';

export default class EmailProvider implements IEmailProvider {
  public async sendEmail(to: string) {
    return;
  }
}
