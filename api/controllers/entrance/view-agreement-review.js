module.exports = {
  friendlyName: 'View agreement review',
  description: 'Display "Agreement review" page.',
  exits: {
    success: {
      viewTemplatePath: 'pages/entrance/agreement-review'
    }
  },
  fn: async function (inputs, exits) {
    const agreements = await TermAgreement.find({
      sort: ['order DESC', 'createdAt ASC']
    });
    let acceptAgreements = this.req.session.agreementRevisions;
    if (!acceptAgreements) {
      acceptAgreements = this.req.cookies.agreementRevisions;
      if (acceptAgreements) {
        acceptAgreements = atob(acceptAgreements);
      }
    }
    const accepted = sails.helpers.exploseString(acceptAgreements);
    this.req.disableLinkToLoginPage = true;
    return exits.success({
      locals: {
        acceptRevisions: accepted,
        agreements: agreements
      }
    });
  }
};
