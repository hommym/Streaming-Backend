import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import { HttpException } from "../exceptions/http/httpException";

export const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpException) {
    res.status(err.statusCode).json({ error: err.message });
  } else if (err instanceof SyntaxError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof MulterError) {
    res.status(400).json({ error: `${err.message} for uploaded file` });
  } else {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};
