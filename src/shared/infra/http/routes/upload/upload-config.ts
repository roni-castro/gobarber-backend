import multer, { StorageEngine } from 'multer';
import path from 'path';

const tmpPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  '..',
  '..',
  'tmp'
);

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpFolder: string;
  uploadsFolder: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',
  tmpFolder: tmpPath,
  uploadsFolder: path.resolve(tmpPath, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpPath,
      filename(request, file, callback) {
        const avatarFilenameFiltered = file.originalname.replace(
          /[^a-zA-Z0-9.]/g,
          '_'
        );
        const filenameHashed = `${new Date().getTime()}-${avatarFilenameFiltered}`;
        return callback(null, filenameHashed);
      },
    }),
  },
  config: {
    disk: {},
    aws: {
      bucket: 'gobarberapps3',
    },
  },
} as IUploadConfig;
