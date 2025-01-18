import { ZodError } from "zod";

import { Request, Response, NextFunction } from "express";
import multer from "multer";
import ApiError from "../utils/ApiError";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  } else if (err instanceof ZodError) {
    const firstErrorMessage =
      err.errors.length > 0 ? err.errors[0].message : "Validation error";

    res.status(400).json({
      success: false,
      message: firstErrorMessage,
      errors: err.errors.map((e) => ({
        path: e.path.join("."), // Join path array to a string if needed
        message: e.message,
      })),
    });
  } else if (err instanceof multer.MulterError) {
    // Handle Multer-specific error
    res.status(500).json({
      success: false,
      message: err.message || "Upload error",
    });
  } else {
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export default errorHandler;
