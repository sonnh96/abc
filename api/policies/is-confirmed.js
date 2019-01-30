/**
 * is-confirmed-in
 *
 * A simple policy that allows any request from an authenticated confirmed user.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function (req, res, proceed) {
  if (req.me) {
    if (req.me.emailChangeCandidate) {
      return proceed();
    }
    if (req.me.emailStatus === 'unconfirmed') {
      return res.email_unconfirmed();
    }
    return proceed();
  }
  return res.unauthorized();
};
