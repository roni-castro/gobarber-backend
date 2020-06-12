import nodemailer, { Transporter } from 'nodemailer';
import IEmailProvider from '../models/IEmailProvider';

export default class EtherealEmailProvider implements IEmailProvider {
  private client: Transporter;

  private async getConnection() {
    if (!this.client) {
      const account = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      this.client = transporter;
    }
    return this.client;
  }

  public async sendEmail(to: string, body: string) {
    let message = {
      from: 'Equipe GoBarber <euipe@gobarber.com.br>',
      to,
      subject: 'Recuperação de senha',
      text: body,
    };
    const client = await this.getConnection();
    const sentMessage = await client.sendMail(message);
    console.log('Message sent: %s', sentMessage.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(sentMessage));
  }
}
