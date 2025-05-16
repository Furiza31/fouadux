import * as msal from "@azure/msal-browser";

const requestedScopes = {
  scopes: ["User.Read"],
};

const msalInstance = new msal.PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
});

export const login = async () => {
  const authResult = await msalInstance.loginPopup(requestedScopes);
  msalInstance.setActiveAccount(authResult.account);
  return authResult;
};
