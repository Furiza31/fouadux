import type { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import type { User } from "../lib/db/schemas";

import env from "../lib/env";

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  else {
    jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
      if (!req.body) {
        req.body = {};
      }
      req.body.user = decoded as User;
      next();
    });
  }
}
