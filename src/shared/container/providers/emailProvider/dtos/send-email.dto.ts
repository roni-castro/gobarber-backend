import IParseEmailTemplateDTO from '../../mailTemplateProvider/dtos/parse-email-template.dto';

interface IEmailContact {
  name: string;
  email: string;
}

export default interface ISendEmailDTO {
  to: IEmailContact;
  from?: IEmailContact;
  subject: string;
  templateData: IParseEmailTemplateDTO;
}
