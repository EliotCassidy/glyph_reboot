'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SendgridClient = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _boom = require('boom');

var _mail = require('@sendgrid/mail');

var _mail2 = _interopRequireDefault(_mail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Transactional Email Service
 */
class SendgridClient {

  constructor({
    sendgridConfig,
    log = (0, _bunyan2.default)({ noop: true })
  } = {}) {
    this.from = sendgridConfig.from;

    this.sendgrid = _mail2.default;
    this.sendgrid.setApiKey(sendgridConfig.apiKey);

    this.log = log.child({ service: 'email-service' });
  }

  /**
   * Send email in text/html format
   *
   * @param {Array} recipients List of recipients
   * @param {String} text Text version of email
   * @param {String} html Html formated version of email
   * @param {Object} substitutions Data to fill template fields
   */
  async sendEmail({ recipient, content, subject, substitutions, from = this.from }) {
    try {
      this.log.info('Sending email', { recipient, from, subject, content: _ramda2.default.isNil(content), substitutions });

      const message = _extends({
        to: recipient,
        from: from,
        subject: subject,
        text: content,
        html: content
      }, substitutions && { dynamic_template_data: substitutions });

      const response = await this.sendgrid.send(message);
      this.log.info('Email sent', { response });

      return response;
    } catch (e) {
      throw (0, _boom.boomify)(e);
    }
  }

  /**
   * Send email using template
   *
   * @param {String} templateId Email service template ID
   * @param {Array} recipients List of recipients
   * @param {Object} substitutions Data to fill template fields
   */
  async sendEmailWithTemplate({ templateId, subject, substitutions, to, from = this.from }) {
    try {
      this.log.info('Sending email', { templateId, to, from, substitutions });

      const message = _extends({
        to,
        from,
        subject,
        templateId
      }, substitutions && { dynamic_template_data: substitutions });

      const response = await this.sendgrid.send(message);
      this.log.info('Email sent', { response });

      return response;
    } catch (e) {
      throw (0, _boom.boomify)(e);
    }
  }
}

exports.SendgridClient = SendgridClient;

exports.default = options => new SendgridClient(options);
//# sourceMappingURL=sendgrid.lib.js.map