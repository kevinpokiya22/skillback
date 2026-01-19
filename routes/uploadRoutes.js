const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure directories exist
const videoDir = 'uploads/videos';
const imageDir = 'uploads/images';
[videoDir, imageDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'video') cb(null, videoDir);
        else cb(null, imageDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = file.fieldname === 'video' ? /mp4|mkv|webm|avi|mov/ : /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(`Error: ${file.fieldname === 'video' ? 'Videos' : 'Images'} Only!`);
        }
    }
});

router.post('/video', upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Please upload a video' });
    const fileUrl = `/uploads/videos/${req.file.filename}`;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json({ url: `${baseUrl}${fileUrl}` });
});

router.post('/image', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Please upload an image' });
    const fileUrl = `/uploads/images/${req.file.filename}`;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json({ url: `${baseUrl}${fileUrl}` });
});

module.exports = router;
