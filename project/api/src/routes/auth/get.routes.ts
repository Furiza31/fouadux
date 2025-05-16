import { getSession } from "@auth/express";
import { Router } from "express";
import { authOptions } from "../../authConfig";
import { useAuthService } from "../../services/auth.service";

const router = Router();
const { getCsrfToken } = useAuthService();

router.get("/auth/popup/:provider", async (req, res) => {
  const { provider } = req.params;
  const token = await getCsrfToken(req, res);
  const callback = "/auth/popup-callback";

  res.send(`
    <!DOCTYPE html>
    <html><body>
      <form id="launch" method="post" action="/oauth/signin/${provider}">
        <input name="csrfToken" type="hidden" value="${token}" />
      </form>
      <script>document.getElementById('launch').submit();</script>
    </body></html>
  `);
});

router.get("/auth/popup-callback", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html><body>
      <script>
        window.close();
      </script>
    </body></html>
  `);
});

router.get("/me", async (req, res) => {
  const session = await getSession(req, authOptions);
  if (session) {
    res.json({ user: session.user });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;
