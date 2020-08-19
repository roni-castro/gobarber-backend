import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import aws from 'aws-sdk';
import emailConfig from '@config/email';
import IEmailProvider from '../models/IEmailProvider';
import ISendEmailDTO from '../dtos/send-email.dto';
import IEmailTemplateProvider from '../../mailTemplateProvider/models/email-template.provider';

@injectable()
export default class SesEmailProvider implements IEmailProvider {
  private client: Transporter;

  constructor(
    @inject('EmailTemplateProvider')
    private emailTemplateProvider: IEmailTemplateProvider
  ) {}

  private async getConnection() {
    if (!this.client) {
      const transporter = nodemailer.createTransport({
        SES: new aws.SES({
          apiVersion: '2010-12-01',
          region: process.env.AWS_DEFAULT_REGION,
        }),
      });
      this.client = transporter;
    }
    return this.client;
  }

  public async sendEmail({ to, from, subject, templateData }: ISendEmailDTO) {
    const template = await this.emailTemplateProvider.parse(templateData);
    const { email, name } = emailConfig.defaults.from;
    const message: SendMailOptions = {
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: template,
    };
    const client = await this.getConnection();
    await client.sendMail(message);
  }
}
