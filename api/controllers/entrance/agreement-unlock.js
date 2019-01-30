const queryString = require('querystring');
module.exports = {
  friendlyName: 'action Unlock agreement',
  description: '',
  inputs: {
    redirect: {
      type: 'string',
      required: true
    }
  },
  fn: async function (inputs, exits) {
    const acceptAgreements = sails.helpers.getAcceptedAgreements(this.req);
    if (await sails.helpers.agreementsAccepted(acceptAgreements)) {
      this.req.session.agreementGuardUnlocked = true;
      return exits.success({
        redirect: inputs.redirect
      });
    } else {
      return exits.success({
        redirect: '/agreement-review?' + queryString.stringify({redirect: inputs.redirect})
      });
    }
  }
};
