exports.handler = async (event) => {
  const code = event.queryStringParameters.code;
  const clientId = "Ov23liH4zHIasLP20pCs";
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      })
    });

    const data = await response.json();
    const token = data.access_token;
    const error = data.error;

    if (error || !token) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: `<!DOCTYPE html><html><body><script>
          window.opener.postMessage(
            'authorization:github:error:' + ${JSON.stringify(error || "no token")},
            '*'
          );
          window.close();
        <\/script><p>Authorization failed. You can close this window.</p></body></html>`
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: `<!DOCTYPE html><html><body><script>
        (function() {
          const message = JSON.stringify({
            token: ${JSON.stringify(token)},
            provider: "github"
          });
          window.opener.postMessage(
            'authorization:github:success:' + message,
            '*'
          );
          window.close();
        })();
      <\/script><p>Authorizing... you can close this window.</p></body></html>`
    };

  } catch (err) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: `<!DOCTYPE html><html><body><script>
        window.opener.postMessage(
          'authorization:github:error:${err.message}',
          '*'
        );
        window.close();
      <\/script><p>Error: ${err.message}</p></body></html>`
    };
  }
};
