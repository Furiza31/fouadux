import type { User } from "@/types/user";
import * as msal from "@azure/msal-browser";

export const requestedScopes = {
  scopes: ["User.Read", "Mail.Read"],
};

const msalInstance = new msal.PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    redirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
});

msalInstance.initialize();

export const login = async (): Promise<User> => {
  const authResult = await msalInstance.loginPopup(requestedScopes);
  msalInstance.setActiveAccount(authResult.account);
  const token = await getAccessToken();
  return {
    email: authResult.account.username,
    token,
    provider: "microsoft",
  };
};

const getAccessToken = async () => {
  const account = msalInstance.getActiveAccount();

  if (!account) {
    throw new Error("No active account! Sign in required.");
  }

  const silentRequest = {
    scopes: requestedScopes.scopes,
    account,
  };

  try {
    const response = await msalInstance.acquireTokenSilent(silentRequest);
    return response.accessToken;
  } catch (error) {
    console.error(
      "Silent token acquisition failed, acquiring token using popup"
    );
    const response = await msalInstance.acquireTokenPopup(requestedScopes);
    return response.accessToken;
  }
};

export const logout = async () => {
  await msalInstance.logoutPopup();
  msalInstance.setActiveAccount(null);
};
