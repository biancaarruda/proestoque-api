import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log(error);

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      erro: error.message,
    });
  }
  
  return response.status(500).json({
    message: "Erro interno do servidor",
  });
}
