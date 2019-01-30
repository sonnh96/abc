/**
 * injectlang hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineInjectlangHook(sails) {
  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: function (done) {
      return done();
    },
    routes: {
      before: {
        '/*': {
          skipAssets: true,
          fn: async function (req, res, next) {
            sails.helpers.injectLang(req);
            const lang = sails.helpers.currentLang(req);
            const availableLanguages = [
              {
                code: 'en', title: 'English', full: 'English'
              },
              {
                code: 'ja', title: '日本語', full: 'Japanese'
              }];
            let index = availableLanguages.findIndex(function (l) {
              return l.code == lang;
            });
            if (index < 0) {
              index = 0;
            }
            req.currentLanguage = availableLanguages[index];
            req.availableLanguages = availableLanguages;
            return next();
          }
        }
      }
    }
  };
};
