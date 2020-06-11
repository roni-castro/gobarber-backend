import { container } from 'tsyringe';
import EmailProvider from './implementations/email.provider';
import IEmailProvider from './models/IEmailProvider';

container.registerSingleton<IEmailProvider>('EmailProvider', EmailProvider);
