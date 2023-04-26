const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://172.1.0.158:4000',
      changeOrigin: true,
    })
  );
};