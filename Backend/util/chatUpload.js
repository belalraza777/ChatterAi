import multer from "multer";
import fs from "fs";
import path from "path";

export const MAX_CHAT_IMAGE_SIZE_MB = 10;
const MAX_CHAT_IMAGE_SIZE_BYTES = MAX_CHAT_IMAGE_SIZE_MB * 1024 * 1024;
const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

// Ensure the uploads directory exists at startup. Multer will not create it automatically, and we want to avoid runtime errors when handling file uploads.
const uploadDirectory = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Map common image MIME types to file extensions for consistent storage and retrieval.
const extensionByMimeType = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

// Configure Multer storage to save uploaded images to the local filesystem with unique filenames to prevent collisions. We use a combination of timestamp and random number for uniqueness.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const extension = extensionByMimeType[file.mimetype] || ".img";
    // Use a unique filename to prevent overwrite collisions.
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

// Multer upload instance with file size limits and MIME type filtering to ensure only valid image files are processed. This middleware will be used in the chat message endpoint to handle optional image uploads.
const upload = multer({
  storage,
  limits: { fileSize: MAX_CHAT_IMAGE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    // Keep validation strict so only image payloads reach the controller.
    if (!allowedImageMimeTypes.has(file.mimetype)) {
      const error = new Error("Only JPG, PNG, WEBP, and GIF images are allowed.");
      error.status = 400;
      return cb(error);
    }

    return cb(null, true);
  },
});

export const uploadChatImage = upload.single("image");
