import { container } from 'tsyringe';
import DiskStorageProvider from '../storageProvider/implementations/disk-storage.provider';
import IStorageProvider from '../storageProvider/models/IStorageProvider';

container.registerSingleton<IStorageProvider>(
  'DiskStorageProvider',
  DiskStorageProvider
);
