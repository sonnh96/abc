module.exports = {
  friendlyName: 'Resend confirm',
  description: '',
  inputs: {},
  exits: {},
  fn: async function (inputs, exits) {
    const me = this.req.me;
    if (me.emailStatus === 'confirmed') {
      return exits.success({redirect: '/'});
    }
    let toEmail, template, subject;
    if (me.emailChangeCandidate) {
      toEmail = me.emailChangeCandidate;
      template = 'email-verify-new-email';
      subject = 'Your account has been updated';
    } else {
      toEmail = me.emailAddress;
      template = 'email-verify-account';
      subject = 'Please confirm your account';
    }
    var valuesToSet = {
      emailProofToken: await sails.helpers.strings.random('url-friendly'),
      emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
    };
    await User.update({id: me.id}).set(valuesToSet);
    await sails.helpers.sendTemplateEmail.with({
      to: toEmail,
      subject: subject,
      template: template,
      templateData: {
        fullName: me.fullName,
        token: valuesToSet.emailProofToken
      }
    });
    return exits.success();
  }
};
