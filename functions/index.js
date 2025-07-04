const functions = require('firebase-functions');
const { https } = functions;
const next = require('next');

const app = next({
  dev: false,
  conf: { distDir: '.next' },
});

const handle = app.getRequestHandler();

exports.nextjs = https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});
