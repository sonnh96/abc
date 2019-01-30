/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {
    'confirmEmail': {'verb': 'GET', 'url': '/email/confirm', 'args': ['token']},
    'logout': {'verb': 'GET', 'url': '/api/v1/account/logout', 'args': []},
    'updatePassword': {'verb': 'PUT', 'url': '/api/v1/account/update-password', 'args': ['password']},
    'updateProfile': {'verb': 'PUT', 'url': '/api/v1/account/update-profile', 'args': ['fullName', 'emailAddress']},
    'updateUserSetting': {
      'verb': 'PUT',
      'url': '/api/v1/account/update-settings',
      'args': ['chartType']
    },
    'updateBillingCard': {
      'verb': 'PUT',
      'url': '/api/v1/account/update-billing-card',
      'args': ['stripeToken', 'billingCardLast4', 'billingCardBrand', 'billingCardExpMonth', 'billingCardExpYear']
    },
    'acceptAgreement': {'verb': 'PUT', 'url': '/api/v1/entrance/accept-agreement', 'args': ['id', 'revision']},
    'unlockAgreement': {'verb': 'PUT', 'url': '/api/v1/entrance/agreement-unlock', 'args': ['redirect']},
    'login': {
      'verb': 'PUT',
      'url': '/api/v1/entrance/login',
      'args': ['emailAddress', 'password', 'rememberMe', 'captchaResponse']
    },
    'adminLogin': {
      'verb': 'PUT',
      'url': '/api/v1/entrance/admin/login',
      'args': ['emailAddress', 'password', 'captchaResponse']
    },
    'signup': {'verb': 'POST', 'url': '/api/v1/entrance/signup', 'args': ['emailAddress', 'password', 'fullName']},
    'sendPasswordRecoveryEmail': {
      'verb': 'POST',
      'url': '/api/v1/entrance/send-password-recovery-email',
      'args': ['emailAddress']
    },
    'updatePasswordAndLogin': {
      'verb': 'POST',
      'url': '/api/v1/entrance/update-password-and-login',
      'args': ['password', 'token']
    },
    // admin
    // permission
    'createPermission': {
      'verb': 'POST',
      'url': '/api/v1/admin/permissions/create',
      'args': ['name', 'code']
    },
    'updatePermission': {
      'verb': 'PUT',
      'url': '/api/v1/admin/permissions/update',
      'args': ['name', 'id']
    },
    'deletePermission': {
      'verb': 'DELETE',
      'url': '/api/v1/admin/permissions',
      'args': ['id', 'code']
    },
    //user type
    'createUserType': {
      'verb': 'POST',
      'url': '/api/v1/admin/user_types/create',
      'args': ['name', 'permissions']
    },
    'updateUserType': {
      'verb': 'PUT',
      'url': '/api/v1/admin/user_types/update',
      'args': ['id', 'name', 'permissions']
    },
    'deleteUserType': {
      'verb': 'DELETE',
      'url': '/api/v1/admin/user_types',
      'args': ['id']
    },
    //end user
    'createEndUser': {
      'verb': 'POST',
      'url': '/api/v1/admin/end_users/create',
      'args': ['emailAddress', 'password', 'fullName', 'userType']
    },
    'updateEndUser': {
      'verb': 'PUT',
      'url': '/api/v1/admin/end_users/update',
      'args': ['id', 'emailAddress', 'password', 'fullName', 'userType']
    },
    'deleteEndUser': {
      'verb': 'DELETE',
      'url': '/api/v1/admin/end_users',
      'args': ['id', 'emailAddress']
    },
    //term
    'createAgreementRevision': {
      'verb': 'POST',
      'url': '/api/v1/admin/agreement/create',
      'args': ['code', 'name', 'file', 'order']
    },
    'updateAgreementRevision': {
      'verb': 'PUT',
      'url': '/api/v1/admin/agreement/update',
      'args': ['id', 'name', 'file', 'order']
    },
    'deleteAgreementRevision': {
      'verb': 'DELETE',
      'url': '/api/v1/admin/agreement',
      'args': ['id']
    },
    'updateGlobalConfig': {
      'verb': 'PUT',
      'url': '/api/v1/admin/update_config',
      'args': ['id', 'value']
    },
    'resendConfirmEmail': {
      'verb': 'POST',
      'url': '/api/v1/account/resend_confirm',
      'args': []
    },
    'activeEndUser': {
      'verb': 'PUT',
      'url': '/api/v1/admin/active_enduser',
      'args': ['id', 'activated']
    },
    'register': {
      'verb': 'PUT',
      'url': '/api/v1/entrance/register',
      'args': ['id', 'price']
    },
    'uploadSettle': {
      'verb': 'POST',
      'url': '/api/v1/admin/agreement/create',
      'args': ['code', 'name', 'file', 'order']
    }
  }
  /* eslint-enable */
});
