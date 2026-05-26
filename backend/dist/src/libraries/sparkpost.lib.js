'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SparkPostClient = undefined;

var _sparkpost = require('sparkpost');

var _sparkpost2 = _interopRequireDefault(_sparkpost);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SparkPostClient {
  constructor({
    sparkAPIKey,
    log = (0, _bunyan2.default)({ noop: true })
  } = {}) {
    this.client = new _sparkpost2.default(sparkAPIKey);
    this.log = log.child({ service: 'mailing-service' });
  }

  async sendHtml({ to, subject, content }) {
    this.log.info('sending html email', { to, subject, content });

    const reqObj = {
      content: {
        subject,
        html: content,
        text: content,
        from: {
          name: 'Glyph',
          email: 'no-reply@glyph.shh.mpg.de'
        }
      },
      recipients: [{ address: to }]
    };
    this.log.info({ reqObj });
    return this.client.transmissions.send(reqObj);
  }
}

exports.SparkPostClient = SparkPostClient;

exports.default = options => new SparkPostClient(options);
//# sourceMappingURL=sparkpost.lib.js.map