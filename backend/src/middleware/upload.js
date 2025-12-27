import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // or your desired folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Optional: file filter, limits, etc.
const upload = multer({ storage }); // you can add limits, fileFilter here

export default upload; // default export of the Multer instance