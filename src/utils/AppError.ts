export class AppError extends Error {
  statusCode: number;
  errorDetails?: any;

  constructor(message: string, statusCode: number = 500, errorDetails?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}