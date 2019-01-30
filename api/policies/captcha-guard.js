/**
 * is-logged-in
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function (req, res, proceed) {
  if (!req.session.captchaAttemptThrottles > 3) {
    return proceed();
  }
  const captchaResponse = req.body.captchaResponse;
  if (!captchaResponse) {
    res.set('X-Exit', 'captchaNotVerified');
    return res.status(401).send('Unauthorized');
  }
  const verified = await sails.helpers.verifyCaptcha(captchaResponse, req.ip);
  if (verified) {
    req.session.captchaAttemptThrottles = 0;
    req.captchaPassed = true;
    return proceed();
  }
  res.set('X-Exit', 'captchaNotVerified');
  return res.status(401).send('Unauthorized');
};
