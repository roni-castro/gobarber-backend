import nodemailer, { Transporter } from 'nodemailer';
import IEmailProvider from '../models/IEmailProvider';

export default class EtherealEmailProvider implements IEmailProvider {
  private client: Transporter;
  constructor() {
    nodemailer.createTestAccount().then(account => {
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
    });
  }
  public async sendEmail(to: string, body: string) {
    let message = {
      from: 'Equipe GoBarber <euipe@gobarber.com.br>',
      to,
      subject: 'Recuperação de senha',
      text: body,
      // html: '<p><b>Hello</b> to myself!</p>',
    };

    const sentMessage = await this.client.sendMail(message);
    console.log('Message sent: %s', sentMessage.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(sentMessage));
  }
}
