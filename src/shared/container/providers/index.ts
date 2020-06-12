import IStorageProvider from './storageProvider/models/IStorageProvider';
import { container } from 'tsyringe';
import DiskStorageProvider from './storageProvider/implementations/disk-storage.provider';
import EtherealEmailProvider from './emailProvider/implementations/ethereal-email.provider';
import IEmailProvider from './emailProvider/models/IEmailProvider';

container.registerSingleton<IStorageProvider>(
  'DiskStorageProvider',
  DiskStorageProvider
);

container.registerSingleton<IEmailProvider>(
  'EmailProvider',
  EtherealEmailProvider
);
