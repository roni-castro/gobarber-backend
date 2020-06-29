import { container } from 'tsyringe';
import IEmailTemplateProvider from '../mailTemplateProvider/models/email-template.provider';
import HandlebarsEmailTemplateProvider from '../mailTemplateProvider/implementations/handlebars-email-template.provoider';

container.registerSingleton<IEmailTemplateProvider>(
  'EmailTemplateProvider',
  HandlebarsEmailTemplateProvider
);
