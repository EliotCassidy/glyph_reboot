'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('source-map-support/register');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _src = require('../src');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = (0, _bunyan2.default)({ name: 'Glyph API' });

const createApp = async ({ pkg, isProduction }) => {
  const serverConfig = _config2.default.get('server');

  const app = (0, _express2.default)();
  const { server, onStart } = await (0, _src.createServer)(_extends({}, serverConfig, {
    pkg
  }));

  app.use((0, _helmet2.default)());
  app.use(server);

  app.use((err, req, res, next) => {
    log.error({ err, reqId: req.id }, 'Request: Fail');

    const error = new _boom2.default(err);
    const status = error.output.statusCode;

    res.status(status).send({
      error: _extends({}, error.output.payload, {
        data: error.data,
        status,
        stack: isProduction ? undefined : error.stack
      })
    });
  });

  return {
    app,
    onStart
  };
};

(async () => {
  log.debug('_______________ -- BOOTSTRAPPING -- ______________');

  if (require.main === module) {
    const isProduction = process.env.NODE_ENV === 'production';
    const port = _config2.default.get('port');

    const pkg = JSON.parse(_fs2.default.readFileSync(_path2.default.resolve(__dirname, _config2.default.get('package-json'))));

    try {
      log.info('Initialize: Start');
      const { app, onStart } = await createApp({ pkg, log, isProduction });

      onStart().then(() => {
        app.listen(port, () => {
          log.info(`🚀  Server: Listening on port ${port}`);
        });
      }).catch(err => {
        log.error({ err }, 'Server: Fail');
        process.exit(1);
      });
    } catch (err) {
      log.error('Initialize: Fail', { err });
      process.exit(1);
    }
  }
})();
//# sourceMappingURL=index.js.map