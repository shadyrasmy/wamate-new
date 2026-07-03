const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('./error.middleware');
const {
    MAX_UPLOAD_BYTES,
    MAX_VIDEO_BYTES,
    getExtension,
    inferMimeType,
    isAllowedDocument,
    isVideoFile
} = require('../utils/media');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const videoTooLargeError = () => new AppError('Videos larger than 10MB are not allowed', 413);

const guardedDiskStorage = {
    _handleFile(req, file, cb) {
        const mimetype = inferMimeType(file.originalname, file.mimetype);
        const isVideo = isVideoFile(file.originalname, mimetype);
        const requestLength = Number(req.headers['content-length']);

        if (isVideo && Number.isFinite(requestLength) && requestLength > MAX_VIDEO_BYTES + (64 * 1024)) {
            file.stream.resume();
            return cb(videoTooLargeError());
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = getExtension(file.originalname);
        const filename = `${uniqueSuffix}${extension}`;
        const filePath = path.join(uploadDir, filename);
        const outStream = fs.createWriteStream(filePath);
        const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_UPLOAD_BYTES;
        let totalBytes = 0;
        let settled = false;

        const cleanup = (err, info) => {
            if (settled) return;
            settled = true;

            if (err) {
                outStream.destroy();
                fs.rm(filePath, { force: true }, () => cb(err));
                return;
            }

            cb(null, info);
        };

        file.stream.on('data', (chunk) => {
            if (settled) return;

            totalBytes += chunk.length;
            if (totalBytes > maxBytes) {
                file.stream.destroy(isVideo ? videoTooLargeError() : new AppError('File larger than 50MB is not allowed', 413));
                return;
            }

            if (!outStream.write(chunk)) {
                file.stream.pause();
            }
        });

        outStream.on('drain', () => {
            if (!settled) file.stream.resume();
        });

        file.stream.on('limit', () => {
            cleanup(isVideo ? videoTooLargeError() : new AppError('File larger than 50MB is not allowed', 413));
        });

        file.stream.on('end', () => {
            if (!settled) outStream.end();
        });

        file.stream.on('error', (err) => {
            cleanup(err);
        });

        outStream.on('error', (err) => {
            cleanup(err);
        });

        outStream.on('finish', () => {
            cleanup(null, {
                destination: uploadDir,
                filename,
                path: filePath,
                size: totalBytes,
                mimetype
            });
        });
    },

    _removeFile(req, file, cb) {
        const filePath = file.path;
        delete file.destination;
        delete file.filename;
        delete file.path;

        if (!filePath) return cb(null);
        fs.rm(filePath, { force: true }, cb);
    }
};

const fileFilter = (req, file, cb) => {
    const mimetype = inferMimeType(file.originalname, file.mimetype);
    // Accept images, videos, audio, and documents
    if (mimetype.startsWith('image/') ||
        mimetype.startsWith('video/') ||
        mimetype.startsWith('audio/') ||
        isAllowedDocument(file.originalname, mimetype)
    ) {
        file.mimetype = mimetype;
        cb(null, true);
    } else {
        cb(new AppError('File type not supported', 400), false);
    }
};

const upload = multer({
    storage: guardedDiskStorage,
    limits: {
        fileSize: MAX_UPLOAD_BYTES
    },
    fileFilter: fileFilter
});

module.exports = upload;
