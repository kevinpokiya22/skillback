const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const imageUpload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Ensure uploads/videos directory exists
const videoUploadDir = 'uploads/videos';
if (!fs.existsSync(videoUploadDir)) {
    fs.mkdirSync(videoUploadDir, { recursive: true });
}

const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, videoUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const videoUpload = multer({
    storage: videoStorage,
    fileFilter: (req, file, cb) => {
        const filetypes = /mp4|mkv|webm|avi|mov/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Videos Only!');
        }
    }
});

// Image upload route
router.post('/image', imageUpload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image' });
    }
    const fileUrl = `/uploads/images/${req.file.filename}`;
    // Using current host for URL construction
    const host = req.get('host');
    const protocol = req.protocol;
    res.json({ url: `${protocol}://${host}${fileUrl}` });
});

// Video upload route
router.post('/video', videoUpload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a video file' });
    }
    const fileUrl = `/uploads/videos/${req.file.filename}`;
    const host = req.get('host');
    const protocol = req.protocol;
    res.json({ url: `${protocol}://${host}${fileUrl}` });
});

module.exports = router;
