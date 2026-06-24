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

    const html = `
      <!DOCTYPE html>
      <html>
      <body>
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("receiveMessage %o", e);
          }
          window.addEventListener("message", receiveMessage, false);
          
          const token = ${JSON.stringify(token)};
          const mess = token
            ? "authorization:github:success:" + JSON.stringify({ token: token, provider: "github" })
            : "authorization:github:error:token not found";

          window.opener.postMessage(mess, "*");
        })();
      </script>
      <p>Authorizing... you can close this window.</p>
      </body>
      </html>
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: html
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
