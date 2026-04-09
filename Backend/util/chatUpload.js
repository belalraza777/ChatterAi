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

const uploadDirectory = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const extensionByMimeType = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

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
