import type { NextFunction, Request, Response } from "express";

function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log("-".repeat(50));
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url}`,
  );
  console.log("-".repeat(50));
  next();
}

export default loggerMiddleware;
