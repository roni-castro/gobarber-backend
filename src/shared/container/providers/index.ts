import IStorageProvider from './storageProvider/models/IStorageProvider';
import { container } from 'tsyringe';
import DiskStorageProvider from './storageProvider/implementations/disk-storage.provider';

container.registerSingleton<IStorageProvider>(
  'DiskStorageProvider',
  DiskStorageProvider
);
