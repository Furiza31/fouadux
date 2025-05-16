import { Request, Response } from "express";
import { port } from "../index";

export const useAuthService = () => {
  const getCsrfToken = async (req: Request, res: Response) => {
    const cookies = req.headers.cookie || "";

    const response = await fetch("http://localhost:" + port + "/oauth/csrf", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookies,
      },
      credentials: "include",
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
    const data = await response.json();
    if (response.ok) {
      return data.csrfToken;
    }
    throw new Error("Failed to fetch CSRF token");
  };

  return {
    getCsrfToken,
  };
};
