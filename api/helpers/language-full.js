const languageMap = {
  'en': 'English',
  'ja': 'Japanese'
};

function currentLang(req) {
  return req.session.lang ? req.session.lang : "ja";
}

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
    return exits.success(languageMap[currentLang(inputs.req)]);
  }
};
