exports.handler = async (event) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
  
  return {
    statusCode: 302,
    headers: { Location: redirectUrl }
  };
};
