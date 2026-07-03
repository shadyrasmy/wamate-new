const path = require('path');

const MAX_VIDEO_BYTES = 10 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const DOCUMENT_MIME_TYPES = new Set([
    'application/pdf',
    'application/msword',
    'application/rtf',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv'
]);

const MIME_BY_EXTENSION = new Map([
    ['.pdf', 'application/pdf'],
    ['.doc', 'application/msword'],
    ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['.xls', 'application/vnd.ms-excel'],
    ['.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ['.ppt', 'application/vnd.ms-powerpoint'],
    ['.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    ['.csv', 'text/csv'],
    ['.txt', 'text/plain'],
    ['.rtf', 'application/rtf'],
    ['.odt', 'application/vnd.oasis.opendocument.text'],
    ['.ods', 'application/vnd.oasis.opendocument.spreadsheet'],
    ['.odp', 'application/vnd.oasis.opendocument.presentation'],
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
    ['.png', 'image/png'],
    ['.gif', 'image/gif'],
    ['.webp', 'image/webp'],
    ['.mp4', 'video/mp4'],
    ['.mov', 'video/quicktime'],
    ['.webm', 'video/webm'],
    ['.mkv', 'video/x-matroska'],
    ['.mp3', 'audio/mpeg'],
    ['.ogg', 'audio/ogg'],
    ['.wav', 'audio/wav'],
    ['.m4a', 'audio/mp4']
]);

const DOCUMENT_EXTENSIONS = new Set(
    [...MIME_BY_EXTENSION.entries()]
        .filter(([, mime]) => DOCUMENT_MIME_TYPES.has(mime))
        .map(([ext]) => ext)
);

const getExtension = (fileName = '') => path.extname(String(fileName)).toLowerCase();

const getMimeTypeFromExtension = (fileName = '') => MIME_BY_EXTENSION.get(getExtension(fileName)) || null;

const inferMimeType = (fileName, currentMimeType) => {
    if (currentMimeType && currentMimeType !== 'application/octet-stream') {
        return currentMimeType;
    }

    return getMimeTypeFromExtension(fileName) || currentMimeType || 'application/octet-stream';
};

const isAllowedDocument = (fileName, mimeType) => {
    const inferred = inferMimeType(fileName, mimeType);
    return DOCUMENT_MIME_TYPES.has(inferred) || DOCUMENT_EXTENSIONS.has(getExtension(fileName));
};

const isVideoFile = (fileName, mimeType) => {
    const inferred = inferMimeType(fileName, mimeType);
    return inferred.startsWith('video/') || ['.mp4', '.mov', '.webm', '.mkv'].includes(getExtension(fileName));
};

const getPublicBaseUrl = () => {
    const configuredUrl = process.env.PUBLIC_URL || process.env.API_PUBLIC_URL;
    if (configuredUrl) return configuredUrl.replace(/\/$/, '');

    return `http://localhost:${process.env.PORT || 3001}`;
};

const getPublicUploadUrl = (fileName, baseUrl = null) => (
    baseUrl || getPublicBaseUrl()
).replace(/\/$/, '') + `/public/uploads/${fileName}`;

const isLocalUploadUrl = (url) => {
    if (!url) return false;
    return String(url).includes('/public/uploads/');
};

const byteLengthToNumber = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    if (typeof value.toNumber === 'function') return value.toNumber();
    if (typeof value.toString === 'function') {
        const parsed = Number(value.toString());
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
};

const safeFileStem = (value = 'file') => (
    String(value)
        .replace(/[^a-z0-9_-]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80) || 'file'
);

module.exports = {
    DOCUMENT_MIME_TYPES,
    MAX_UPLOAD_BYTES,
    MAX_VIDEO_BYTES,
    PROFILE_IMAGE_MAX_BYTES,
    byteLengthToNumber,
    getExtension,
    getMimeTypeFromExtension,
    getPublicBaseUrl,
    getPublicUploadUrl,
    inferMimeType,
    isAllowedDocument,
    isLocalUploadUrl,
    isVideoFile,
    safeFileStem
};
