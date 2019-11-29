"use strict";
const express = require("express");
const compression = require("compression");
const router = express.Router();

const _port = 4201;
const _app_folder = "./dist/wubs-refunds";
const _context = "/refunds-ui";

const app = express();

router.all('*', (req, res) => {
  res.status(200).sendFile('/', {root: _app_folder});
});

app.use(compression());
app.use(_context, router);
app.use(_context, express.static(_app_folder, {maxAge: '1y'}));

app.listen(_port, () => {
  console.log(`Node Express Server for WUBS Refunds UI App listening on http://localhost:${_port}${_context}/`);
});
