const querystring = require('querystring');
module.exports = async function (req, res, next) {
  const query = {
    redirect: req.path
  };
  if (!req.session.agreementGuardUnlocked) {
    return res.redirect(`/agreement-review?${querystring.stringify(query)}`);
  }
  const acceptAgreements = sails.helpers.getAcceptedAgreements(req);
  if (await sails.helpers.agreementsAccepted(acceptAgreements)) {
    return next();
  }
  return res.redirect(`/agreement-review?${querystring.stringify(query)}`);
};
