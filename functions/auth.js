exports.handler = async (event) => {
  const clientId = "Ov23lih4zHIasLP20pCs";
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
  
  return {
    statusCode: 302,
    headers: { Location: redirectUrl }
  };
};
