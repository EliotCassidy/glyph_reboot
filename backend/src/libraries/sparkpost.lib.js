import SparkPost from 'sparkpost'
import bunyan from 'bunyan'

export class SparkPostClient {
  constructor({
    sparkAPIKey,
    log = bunyan({ noop: true })
  } = {}) {
    this.client = new SparkPost(sparkAPIKey)
    this.log = log.child({ service: 'mailing-service' })
  }


  async sendHtml({ to, subject, content }) {
    this.log.info('sending html email', { to, subject, content })

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
    }
    this.log.info({ reqObj })
    return this.client.transmissions.send(reqObj)
  }
}

export default options => new SparkPostClient(options)
