import { container } from 'tsyringe';
import EtherealEmailProvider from './implementations/ethereal-email.provider';
import SesEmailProvider from './implementations/ses-email.provider';
import emailConfig from '@config/email';
import IEmailProvider from './models/IEmailProvider';

const providers = {
  ethereal: container.resolve(EtherealEmailProvider),
  ses: container.resolve(SesEmailProvider),
};

container.registerInstance<IEmailProvider>(
  'EmailProvider',
  providers[emailConfig.driver]
);
