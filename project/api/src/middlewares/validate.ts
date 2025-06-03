import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodSchema } from "zod";

import { ZodError } from "zod";

export function validate(schema: ZodSchema, key: "body" | "query" | "params"): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (key === "query") {
        const queryObj: Record<string, unknown> = {};
        Object.keys(req.query).forEach((k) => {
          const val = req.query[k];
          if (typeof val === "string") {
            if (/^\d+$/.test(val)) {
              queryObj[k] = Number.parseInt(val, 10);
            }
            else if (/^\d+\.\d+$/.test(val)) {
              queryObj[k] = Number.parseFloat(val);
            }
            else {
              queryObj[k] = val;
            }
          }
          else {
            queryObj[k] = val;
          }
        });
        schema.parse(queryObj);
      }
      else {
        const original = req[key];
        const parsed = schema.parse(req[key]);

        // Préserver les champs existants comme 'user' tout en ajoutant les champs validés
        req[key] = { ...original, ...parsed };
      }
      next();
    }
    catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map(e => ({
          field: e.path.join("."),
          message: e.message,
        }));

        const errorMessage = key === "body"
          ? "Validation failed"
          : key === "query"
            ? "Query validation failed"
            : "Parameter validation failed";

        res.status(400).json({ error: errorMessage, details });
      }
      else {
        console.error("Validation error:", error);
        res.status(500).json({ error: "Internal server error during validation" });
      }
    }
  };
}
