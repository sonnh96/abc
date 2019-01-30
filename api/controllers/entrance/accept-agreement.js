const _ = require('@sailshq/lodash');

module.exports = {
  friendlyName: 'Accept agreement',
  description: '',
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    revision: {
      type: 'number',
      required: true,
    }
  },
  exits: {},
  fn: async function (inputs, exits) {
    const acceptAgreements = sails.helpers.getAcceptedAgreements(this.req);
    let accepted = sails.helpers.exploseString(acceptAgreements);
    accepted.push(`${inputs.id}_${inputs.revision}`);
    accepted = _.uniq(accepted);
    const agreements = await TermAgreement.find({
      sort: ['order DESC', 'createdAt ASC']
    });
    const availableRevisions = agreements.map(t => {
      return `${t.id}_${t.revision}`;
    });
    accepted = accepted.filter(testRevision => {
      return availableRevisions.some(function (r) {
        return r === testRevision;
      });
    });
    const acceptedStr = accepted.join(',');
    this.req.session.agreementRevisions = acceptedStr;
    const agreementAge = new Date();
    agreementAge.setFullYear(agreementAge.getFullYear() + 5);
    this.res.cookie('agreementRevisions', btoa(acceptedStr), {httpOnly: true, expires: agreementAge});
    return exits.success({
      acceptRevisions: accepted,
      agreements: agreements
    });
  }
};
