import { config } from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import Config from '../config';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    error:Config.node_env === 'development' ? err : undefined,
  });
};