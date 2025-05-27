import { revokeAccessToken } from "vue3-google-signin";

export const googleRequestedScopes = {
  scope: [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/gmail.readonly",
  ].join(" "),
};

export const getUserInformations = async ({ token }: { token: string }) => {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const profile = await res.json();
  return profile;
};

export const logout = async ({ token }: { token: string }) => {
  try {
    revokeAccessToken(token);
  } catch (error) {
    console.error("Error revoking token:", error);
  }
};
