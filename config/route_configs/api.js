module.exports = {
  '/api/v1/account/logout':                           { action: 'account/logout' },
  'PUT   /api/v1/account/update-password':            { action: 'account/update-password' },
  'PUT   /api/v1/account/update-profile':             { action: 'account/update-profile' },
  'PUT   /api/v1/entrance/login':                        { action: 'entrance/login' },
  'POST  /api/v1/entrance/signup':                       { action: 'entrance/signup' },
  'POST  /api/v1/entrance/send-password-recovery-email': { action: 'entrance/send-password-recovery-email' },
  'POST  /api/v1/entrance/update-password-and-login':    { action: 'entrance/update-password-and-login' },
  'GET /api/get_language': 'SessionController.getLanguage',
  'POST /api/set_language':           {controller: 'SessionController', action: 'setLanguage', csrf: false},
  'POST /api/v1/save_question':       {action: 'manages/save-question', csrf: false},
  'POST /api/v1/save_comment':        {action: 'manages/save-comment', csrf: false},
  'POST /api/v1/save_answer':         {action: 'manages/save-answer', csrf: false},
};
