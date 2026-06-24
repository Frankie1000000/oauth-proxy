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

    const text = await response.text();
    const params = new URLSearchParams(text);
    const token = params.get("access_token");
    const error = params.get("error");

    if (error || !token) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: `<!DOCTYPE html>
<html>
<body>
<script>
  (function() {
    var msg = "authorization:github:error:" + ${JSON.stringify(error || "no token received")};
    window.opener && window.opener.postMessage(msg, "*");
    window.close();
  })();
<\/script>
<p>Authorization failed.</p>
</body>
</html>`
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: `<!DOCTYPE html>
<html>
<body>
<script>
  (function() {
    var token = ${JSON.stringify(token)};
    var msg = "authorization:github:success:" + JSON.stringify({
      token: token,
      provider: "github"
    });
    window.opener && window.opener.postMessage(msg, "*");
    window.close();
  })();
<\/script>
<p>Authorizing... you can close this window.</p>
</body>
</html>`
    };

  } catch (err) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: `<!DOCTYPE html>
<html>
<body>
<script>
  (function() {
    var msg = "authorization:github:error:" + ${JSON.stringify(err.message)};
    window.opener && window.opener.postMessage(msg, "*");
    window.close();
  })();
<\/script>
<p>Error occurred.</p>
</body>
</html>`
    };
  }
};
