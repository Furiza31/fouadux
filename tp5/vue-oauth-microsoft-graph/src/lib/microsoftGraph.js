import * as msal from '@azure/msal-browser';

const requestedScopes = {
  scopes: ['User.Read', 'Mail.Read']
}

export const msalInstance = new msal.PublicClientApplication({
  auth: {
    clientId: process.env.VUE_APP_OAUTH_CLIENT_ID
  },
  cache: {
    cacheLocation: 'sessionStorage'
  }
})

let msalInitialized = false;
export const initializeMsal = async () => {
  if (!msalInitialized) {
    await msalInstance.initialize();
    msalInitialized = true;
  }
  return msalInstance;
};

export async function signInAndGetUser() {
  await initializeMsal();
  const authResult = await msalInstance.loginPopup(requestedScopes)

  msalInstance.setActiveAccount(authResult.account)
  return authResult.account
}

async function getAccessToken() {
  await initializeMsal();
  const account = msalInstance.getActiveAccount()

  if (!account) {
    throw new Error('No active account! Sign in required.')
  }

  const silentRequest = {
    scopes: requestedScopes.scopes,
    account
  }

  try {
    const response = await msalInstance.acquireTokenSilent(silentRequest)
    return response.accessToken
  } catch (error) {
    console.error('Silent token acquisition failed, acquiring token using popup')
    const response = await msalInstance.acquireTokenPopup(requestedScopes)
    return response.accessToken
  }
}

async function callMsGraph(endpoint, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }

  const response = await fetch(`https://graph.microsoft.com/v1.0${endpoint}`, {
    headers
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`)
  }

  return await response.json()
}

export async function getConversations(top = 20) {
  try {
    const accessToken = await getAccessToken()
    const data = await callMsGraph(`/me/messages?$top=${top}&$orderby=receivedDateTime desc`, accessToken)
    return data.value
  } catch (error) {
    console.error('Error fetching conversations:', error)
    throw error
  }
}

export async function getConversation(messageId) {
  try {
    const accessToken = await getAccessToken()
    const data = await callMsGraph(`/me/messages/${messageId}`, accessToken)
    return data
  } catch (error) {
    console.error(`Error fetching conversation ${messageId}:`, error)
    throw error
  }
}