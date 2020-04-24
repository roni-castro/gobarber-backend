import multer from 'multer';
import path from 'path';

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', '..', 'tmp'),
    filename(request, file, callback) {
      const filenameHashed = `${new Date()}-${file.originalname}`;
      return callback(null, filenameHashed);
    },
  }),
};
