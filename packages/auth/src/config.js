export const config = () => ({
    clientId: '0oa3asmnoJt6Aj4ji5d6',
    issuer: 'https://dev-9755339-admin/oauth2/default',
    redirectUri: 'http://localhost:8080',
    scopes: ['openid', 'profile', 'email'],
    pkce: true
})

export const oktaSignInConfig = {
    baseUrl: 'https://dev-9755339-admin.okta.com',
    clientId: '{clientId}',
    redirectUri: window.location.origin,
    authParams: {
      // If your app is configured to use the Implicit Flow
      // instead of the Authorization Code with Proof of Code Key Exchange (PKCE)
      // you will need to uncomment the below line
      // pkce: false
    }
  };