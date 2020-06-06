import multer from 'multer';
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

export default {
  tmpFolder: tmpPath,
  uploadsFolder: path.resolve(tmpPath, 'uploads'),
  storage: multer.diskStorage({
    destination: tmpPath,
    filename(request, file, callback) {
      const filenameHashed = `${new Date().getTime()}-${file.originalname}`;
      return callback(null, filenameHashed);
    },
  }),
};
