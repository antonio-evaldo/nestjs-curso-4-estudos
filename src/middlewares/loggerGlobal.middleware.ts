import { NextFunction, Request, Response } from 'express';

export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
  const rota = req.path;
  console.log(`Rota acessada: ${rota}`);
  next();
}
