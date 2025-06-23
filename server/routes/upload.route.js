const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

const upload = multer({ dest: 'uploads/' }); // temp storage

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'product-images',
    });

    // delete temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

module.exports = router;