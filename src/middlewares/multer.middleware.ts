import multer, { StorageEngine } from "multer";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";
import path from "path";
import ApiError from "../utils/ApiError";

const storage: StorageEngine = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ): void {
    cb(null, "./public/temp");
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ): void {
    const uniqueFilename = uuidv4();
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname); // Better way to get the file extension
    const formattedFilename = `${uniqueFilename}_${timestamp}${fileExtension}`;

    cb(null, formattedFilename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Set limit to 10MB
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    // Allow images
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "File type not supported"));
    }
  },
});

export { upload };
