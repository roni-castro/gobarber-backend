import path from 'path';
import fs from 'fs';
import IStorageProvider from '../models/IStorageProvider';
import uploadConfig from '@shared/infra/http/routes/upload/upload-config';

export default class DiskStorageProvider implements IStorageProvider {
  async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file)
    );
    return file;
  }
  async deleteFile(file: string): Promise<void> {
    const userAvatarFilePath = path.join(uploadConfig.tmpFolder, file);
    try {
      await fs.promises.stat(userAvatarFilePath);
      await fs.promises.unlink(userAvatarFilePath);
    } catch {}
  }
}
