import IStorageProvider from './storageProvider/models/IStorageProvider';
import { container } from 'tsyringe';
import emailConfig from '@config/email';
import DiskStorageProvider from './storageProvider/implementations/disk-storage.provider';
import EtherealEmailProvider from './emailProvider/implementations/ethereal-email.provider';
import IEmailProvider from './emailProvider/models/IEmailProvider';
import IEmailTemplateProvider from './mailTemplateProvider/models/email-template.provider';
import HandlebarsEmailTemplateProvider from './mailTemplateProvider/implementations/handlebars-email-template.provoider';
import SesEmailProvider from './emailProvider/implementations/ses-email.provider';

container.registerSingleton<IStorageProvider>(
  'DiskStorageProvider',
  DiskStorageProvider
);

container.registerSingleton<IEmailProvider>(
  'EmailProvider',
  emailConfig.driver === 'ethereal' ? EtherealEmailProvider : SesEmailProvider
);

container.registerSingleton<IEmailTemplateProvider>(
  'EmailTemplateProvider',
  HandlebarsEmailTemplateProvider
);
