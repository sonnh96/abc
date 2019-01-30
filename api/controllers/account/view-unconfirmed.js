module.exports = {
  friendlyName: 'View unconfirmed',
  description: 'Display "Unconfirmed" page.',
  exits: {
    success: {
      viewTemplatePath: 'pages/unconfirmed'
    },
    redirect: {
      description: 'The requesting user is already logged in.',
      responseType: 'redirect'
    }
  },
  fn: async function (inputs, exits) {
    if (this.req.me && this.req.me.emailStatus == 'confirmed') {
      throw {redirect: '/'};
    }
    return exits.success();
  }
};
