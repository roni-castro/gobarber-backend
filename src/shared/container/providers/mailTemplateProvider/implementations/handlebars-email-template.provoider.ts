import fs from 'fs';
import handlebars from 'handlebars';
import IParseEmailTemplateDTO from '../dtos/parse-email-template.dto';
import IEmailTemplateProvider from '../models/email-template.provider';

export default class HandlebarsEmailTemplateProvider
  implements IEmailTemplateProvider {
  public async parse({ file, variables }: IParseEmailTemplateDTO) {
    const template = await fs.promises.readFile(file, {
      encoding: 'utf-8'
    });
    const parseTemplate = handlebars.compile(template);
    return parseTemplate(variables);
  }
}
