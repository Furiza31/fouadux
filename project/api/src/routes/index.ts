import { Router } from "express";

import mailsDeleteRouter from "./mail/delete.route";
import mailsGetRouter from "./mail/get.route";
import mailsPostRouter from "./mail/post.route";
import userPostRouter from "./user/post.route";

const router = Router();

router.use("/users", userPostRouter);

router.use("/mails", mailsGetRouter);
router.use("/mails", mailsPostRouter);
router.use("/mails", mailsDeleteRouter);

export default router;
