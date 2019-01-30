const sails = require('sails');

module.exports = {
  sync: true,
  friendlyName: 'Language',
  description: 'Session Language.',
  inputs: {
    req: {
      type: 'ref',
      required: true,
    }
  },
  fn: function (inputs, exits) {
    const req = inputs.req;
    const lang = req.query.hl || req.session.lang;
    req.session.lang = lang || "ja";
    req.setLocale(req.session.lang);
    sails.hooks.i18n.setLocale(req.session.lang);
    return exits.success(req.session.lang);
  }
};

