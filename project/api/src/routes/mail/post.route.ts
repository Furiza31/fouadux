import type { Request, Response } from "express";

import { Router } from "express";
import z from "zod";

import type { User } from "../../lib/db/schemas";

import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { useMailService } from "../../services/mail.service";

const router = Router();

const PostInsertMail = z.object({
  subject: z.string(),
  sender: z.string(),
  body: z.string(),
  to: z.string(),
});

router.post(
  "/",
  auth,
  validate(PostInsertMail, "body"),
  async (req: Request, res: Response) => {
    try {
      const user = req.body.user as User;
      const mailData = req.body;
      const response = await useMailService().insertMail(user, mailData);
      res.status(201).json({
        message: "Mail created successfully",
        data: response,
      });
    }
    catch (error) {
      console.error("Error creating mail:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
