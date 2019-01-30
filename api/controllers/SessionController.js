/**
 * SessionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getLanguage: function (req, res) {
    return res.ok({
      'language': req.session.lang ? req.session.lang : "en"
    });
  },
  setLanguage: function (req, res) {
    const param = req.body;
    req.session.lang = param.language;
    sails.hooks.i18n.setLocale(param.language);
    return res.ok({
      'error': false
    });
  },
};

