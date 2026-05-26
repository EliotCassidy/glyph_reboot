import R from 'ramda'
import bunyan from 'bunyan'

import {
  boomify,
} from 'boom'

import sendgrid from '@sendgrid/mail'

/**
 * Transactional Email Service
 */
export class SendgridClient {

  constructor({
    sendgridConfig,
    log = bunyan({ noop: true })
  } = {}) {
    this.from = sendgridConfig.from

    this.sendgrid = sendgrid
    this.sendgrid.setApiKey(sendgridConfig.apiKey);

    this.log = log.child({ service: 'email-service' })
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
      this.log.info('Sending email', { recipient, from, subject, content: R.isNil(content), substitutions })

      const message = {
        to: recipient,
        from: from,
        subject: subject,
        text: content,
        html: content,
        ...(substitutions && { dynamic_template_data: substitutions })
      };

      const response = await this.sendgrid.send(message);
      this.log.info('Email sent', { response })

      return response
    } catch (e) {
      throw boomify(e)
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
      this.log.info('Sending email', { templateId, to, from, substitutions })

      const message = {
        to,
        from,
        subject,
        templateId,
        ...(substitutions && { dynamic_template_data: substitutions })
      }

      const response = await this.sendgrid.send(message)
      this.log.info('Email sent', { response })

      return response
    } catch (e) {
      throw boomify(e)
    }
  }
}

export default options => new SendgridClient(options)
