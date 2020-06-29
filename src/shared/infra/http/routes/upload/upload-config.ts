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
      const avatarFilenameFiltered = file.originalname.replace(
        /[^a-zA-Z0-9.]/g,
        '_'
      );
      const filenameHashed = `${new Date().getTime()}-${avatarFilenameFiltered}`;
      return callback(null, filenameHashed);
    },
  }),
};
