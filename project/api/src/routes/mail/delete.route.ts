import type { Request, Response } from "express";

import { Router } from "express";
import { z } from "zod";

import type { User } from "../../lib/db/schemas";

import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { useMailService } from "../../services/mail.service";

const router = Router();

const deleteMail = z.object({
  mailId: z.string(),
});

router.delete(
  "/:mailId",
  auth,
  validate(deleteMail, "params"),
  async (req: Request, res: Response) => {
    try {
      const user = req.body.user as User;
      const mailId = req.params.mailId;
      await useMailService().deleteMail(user, mailId);
      res.status(200).json({
        message: "Mail deleted successfully",
      });
    }
    catch (error) {
      console.error("Error deleting mail:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
