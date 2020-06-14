import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import IEmailProvider from '../models/IEmailProvider';
import ISendEmailDTO from '../dtos/send-email.dto';
import { inject, injectable } from 'tsyringe';
import IEmailTemplateProvider from '../../mailTemplateProvider/models/email-template.provider';

@injectable()
export default class EtherealEmailProvider implements IEmailProvider {
  private client: Transporter;

  constructor(
    @inject('EmailTemplateProvider')
    private emailTemplateProvider: IEmailTemplateProvider
  ) {}

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

  public async sendEmail({ to, from, subject, templateData }: ISendEmailDTO) {
    const template = await this.emailTemplateProvider.parse(templateData);
    let message: SendMailOptions = {
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: template,
    };
    const client = await this.getConnection();
    const sentMessage = await client.sendMail(message);
    console.log('Message sent: %s', sentMessage.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(sentMessage));
  }
}
