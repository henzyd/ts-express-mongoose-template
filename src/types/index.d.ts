import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      [key: string]: any;
    }
  }

  interface CustomError {
    field: string;
    message: string;
  }
}
