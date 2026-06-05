import { NextFunction, Request, Response } from "express";

export function errorHandler(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log(error);

  return response.status(500).json({
    message: "Erro interno do servidor",
  });
}
