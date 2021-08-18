const { createProxyMiddleware } = require("http-proxy-middleware");

const proxyAddress =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:8060"
    : "https://trygauss.com";

module.exports = (app) => {
  app.use(
    createProxyMiddleware(["/api", "/ws", "/wss"], {
      target: proxyAddress,
      ws: true,
    })
  );
};
