import type { Request, Response } from "express";

import { Router } from "express";
import { z } from "zod";

import { validate } from "../../middlewares/validate";
import { useMailService } from "../../services/mail.service";
import { userService } from "../../services/user.service";

const router = Router();

const PostUserWithProvider = z.object({
  email: z.string().email().min(1),
  uuid: z.string().min(1),
  name: z.string().min(1),
  token: z.string().min(1),
  expireAt: z.string().min(1),
});

router.post(
  "/",
  validate(PostUserWithProvider, "body"),
  async (req: Request, res: Response) => {
    try {
      const { email, uuid, name, token, expireAt } = req.body;
      const response = await userService().getUser({
        email,
        uuid,
        name,
        providerToken: token,
        expireAt,
      });
      await useMailService().init(response.user);
      res.status(201).json({
        message: "User connected successfully",
        data: response,
      });
    }
    catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
