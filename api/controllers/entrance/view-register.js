module.exports = {
  friendlyName: 'View signup',
  description: 'Display "Signup" page.',
  exits: {
    success: {
      viewTemplatePath: 'pages/entrance/register',
    },
    redirect: {
      description: 'The requesting user is already logged in.',
      responseType: 'redirect'
    }
  },
  fn: async function (inputs, exits) {
    var data;
    if (this.req.me) {
      data = await UserType.find({forFirst: false}).populate('permissions');
    } else {
      data = await UserType.find({forFirst: true}).populate('permissions');
    }
    return exits.success({locals: data});
  }
};
