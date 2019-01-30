const nodemailer = require('nodemailer');

class NodeMailer {
  constructor(transporter, fromAddress) {
    this.transporter = transporter;
    this.fromAddress = fromAddress;
  }

  send(options) {
    const mailContent = {
      from: this.fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.htmlMessage
    };
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailContent, function (err, info) {
        if (err) {
          reject(err);
        } else {
          resolve({status: 'success'});
        }
      });
    });
  }
}


module.exports = {
  sync: true,
  friendlyName: 'Nodejs mailer',
  description: 'Create nodejs mailer sender',
  inputs: {
    transporter: {
      type: 'ref',
      description: 'transporter config',
      required: true,
    },
    from: {
      type: 'string',
      description: 'From email address',
      required: true,
    }
  },
  fn: function (inputs, exits) {
    const transporter = nodemailer.createTransport(inputs.transporter);
    const sender = new NodeMailer(transporter, inputs.from);
    return exits.success(sender);
  }
};

