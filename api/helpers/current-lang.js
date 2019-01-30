module.exports = {
  sync: true,
  friendlyName: 'Language full',
  description: 'Map language in session to full language name',
  inputs: {
    req: {
      type: 'ref',
      required: true,
    }
  },
  fn: function (inputs, exits) {
    const req = inputs.req;
    const lang = req.query.lang || req.session.lang;
    return exits.success(lang ? lang : "ja");
  }
};

