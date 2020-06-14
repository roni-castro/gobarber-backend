import IParseEmailTemplateDTO from '../dtos/parse-email-template.dto';

export default interface IEmailTemplateProvider {
  parse(data: IParseEmailTemplateDTO): Promise<string>;
}
