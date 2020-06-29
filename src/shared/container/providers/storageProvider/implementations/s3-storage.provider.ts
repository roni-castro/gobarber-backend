import path from 'path';
import fs from 'fs';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import IStorageProvider from '../models/IStorageProvider';
import uploadConfig from '@shared/infra/http/routes/upload/upload-config';

export default class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: process.env.AWS_DEFAULT_REGION,
    });
  }

  async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);
    const fileContentStream = await fs.promises.readFile(originalPath);
    const contentType = mime.getType(originalPath);
    const params = {
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
      Body: fileContentStream,
      ACL: 'public-read',
      ContentType: contentType,
    } as S3.Types.PutObjectRequest;
    await this.client.putObject(params).promise();
    await this.deleteFileTmp(file);
    return file;
  }

  async deleteFileTmp(file: string): Promise<void> {
    const userAvatarFilePath = path.join(uploadConfig.tmpFolder, file);
    try {
      await fs.promises.stat(userAvatarFilePath);
      await fs.promises.unlink(userAvatarFilePath);
    } catch {}
  }

  async deleteFile(file: string): Promise<void> {
    const params = {
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
    };
    await this.client.deleteObject(params).promise();
  }
}
