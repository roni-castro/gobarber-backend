import { container } from 'tsyringe';
import DiskStorageProvider from '../storageProvider/implementations/disk-storage.provider';
import IStorageProvider from '../storageProvider/models/IStorageProvider';
import S3StorageProvider from './implementations/s3-storage.provider';
import uploadConfig from '@shared/infra/http/routes/upload/upload-config';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver]
);
