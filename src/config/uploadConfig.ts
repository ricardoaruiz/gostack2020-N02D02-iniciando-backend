import path from 'path';
import multer from 'multer';

export const config = {
  destination: path.resolve(__dirname, '..', '..', 'tmp'),
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, config.destination);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});

export default multer({ storage });
