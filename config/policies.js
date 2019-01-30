/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  '*': 'is-logged-in',
  DashboardController: {
    '*': ['is-logged-in', 'is-confirmed'],
  },
  SessionController: {
    '*': true,
  },
  AdminController: {
    '*': ['is-super-admin']
  },
  // Bypass the `is-logged-in` policy for:
  'entrance/*': true,
  'account/logout': true,

};