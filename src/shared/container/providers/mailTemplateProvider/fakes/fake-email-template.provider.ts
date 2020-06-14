import IEmailTemplateProvider from '../models/email-template.provider';

export default class FakeEmailTemplateProvider
  implements IEmailTemplateProvider {
  public async parse() {
    return 'Email message';
  }
}
