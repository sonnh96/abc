/**
 * email_unconfirmed.js
 *
 * A custom response.
 *
 * Example usage:
 * ```
 *     return res.email_unconfirmed();
 *     // -or-
 *     return res.email_unconfirmed(optionalData);
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'email_unconfirmed'
 *       }
 *     }
 * ```
 *
 * ```
 *     throw 'somethingHappened';
 *     // -or-
 *     throw { somethingHappened: optionalData }
 * ```
 */

module.exports = function email_unconfirmed() {
  var req = this.req;
  var res = this.res;
  if (req.wantsJSON) {
    return res.status(401).json({status: 'email is unconfirmed'});
  }
  return res.redirect('/unconfirmed');
};
