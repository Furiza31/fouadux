import type { Request, Response } from "express";

import { Router } from "express";
import { z } from "zod";

import type { User } from "../../lib/db/schemas";

import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { useMailService } from "../../services/mail.service";

const router = Router();

const getMails = z.object({
  page: z.number().optional(),
});

router.get(
  "/",
  auth,
  validate(getMails, "query"),
  async (req: Request, res: Response) => {
    try {
      const user = req.body.user as User;
      const response = await useMailService().getMails(user, req.query.page ? Number(req.query.page) : 1);
      res.status(200).json({
        message: "Mails retrieved successfully",
        data: response,
      });
    }
    catch (error) {
      console.error("Error retrieving mails:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.get(
  "/dashboard",
  auth,
  async (req: Request, res: Response) => {
    try {
      const user = req.body.user as User;
      const response = await useMailService().dashboard(user);
      res.status(200).json({
        message: "Dashboard initialized successfully",
        data: response,
      });
    }
    catch (error) {
      console.error("Error initializing dashboard:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

const getMail = z.object({
  mailId: z.string(),
});

router.get(
  "/:mailId",
  auth,
  validate(getMail, "params"),
  async (req: Request, res: Response) => {
    try {
      const user = req.body.user as User;
      const mailId = req.params.mailId;
      const response = await useMailService().getMail(user, mailId);
      if (!response) {
        res.status(404).json({ error: "Mail not found" });
      }
      else {
        res.status(200).json({
          message: "Mail retrieved successfully",
          data: response,
        });
      }
    }
    catch (error) {
      console.error("Error retrieving mail:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
