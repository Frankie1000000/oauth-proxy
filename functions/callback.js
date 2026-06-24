const fetch = require("node-fetch");

exports.handler = async (event) => {
  const code = event.queryStringParameters.code;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code })
  });

  const data = await response.json();

  const script = `
    <script>
      const token = "${data.access_token}";
      const message = token 
        ? { token, provider: "github" }
        : { error: "OAuth failed" };
      window.opener.postMessage(
        "authorization:github:success:" + JSON.stringify(message),
        "*"
      );
    </script>
  `;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: script
  };
};
