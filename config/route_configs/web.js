module.exports = {
  'GET /':                   'DashboardController.index',

  'GET /signup':             { action: 'entrance/view-signup' },
  'GET /email/confirm':      { action: 'entrance/confirm-email' },
  'GET /email/confirmed':    { view:   'pages/entrance/confirmed-email' },

  'GET /login':              { action: 'entrance/view-login' },
  'GET /password/forgot':    { action: 'entrance/view-forgot-password' },
  'GET /password/new':       { action: 'entrance/view-new-password' },
  'GET /unconfirmed':        {action: 'account/view-unconfirmed'},

  'GET /account':            { action: 'account/view-account-overview' },
  'GET /account/password':   { action: 'account/view-edit-password' },
  'GET /account/profile':    { action: 'account/view-edit-profile' },
  '/terms':                   '/legal/terms',
  '/logout':                  '/api/v1/account/logout',
  'GET /test':                      { action: 'test/test' },
  'GET /admin/dashboard':           {action: 'admin/dashboard'},
  'GET /admin/user_manager':        'AdminController.userManager',
  'GET /admin/type_manager':        'AdminController.typeManager',
  'GET /detail':                    {action: 'manages/details'}
};
