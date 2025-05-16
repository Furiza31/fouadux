import { getSession } from "@auth/express";
import { User } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { authOptions } from "../authConfig";

declare module "express" {
  interface Request {
    user?: User;
  }
}

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = await getSession(req, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = session.user as User;
  next();
}
