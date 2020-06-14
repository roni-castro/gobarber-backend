import ISendEmailDTO from '../dtos/send-email.dto';

export default interface IEmailProvider {
  sendEmail(data: ISendEmailDTO): Promise<void>;
}
