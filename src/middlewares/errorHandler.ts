import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorDetails: any = err?.message || null;

  // Custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err.errorDetails ?? err.message;
  }
  // Zod validation error
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errorDetails = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  }
  // Prisma known errors (e.g. unique constraint)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    if (err.code === 'P2002') {
      message = `Duplicate value for field: ${err.meta?.target}`;
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    } else {
      message = 'Database error';
    }
    errorDetails = err.message;
  }
  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errorDetails: null,
  });
};