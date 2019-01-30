module.exports = {


  friendlyName: 'View new password',


  description: 'Display "New password" page.',


  inputs: {

    token: {
      description: 'The password reset token from the email.',
      example: '4-32fad81jdaf$329'
    }

  },


  exits: {

    success: {
      viewTemplatePath: 'pages/entrance/register',
    },

    invalidOrExpiredToken: {
      responseType: 'expired',
      description: 'The provided token is expired, invalid, or has already been used.',
    }

  },


  fn: async function (inputs, exits) {

    // If password reset token is missing, display an error page explaining that the link is bad.
    if (!inputs.token) {
      sails.log.warn('Attempting to view new password (recovery) page, but no reset password token included in request!  Displaying error page...');
      throw 'invalidOrExpiredToken';
    }//•

    // Look up the user with this reset token.
    var userRecord = await User.findOne({registerToken: inputs.token});
    if (userRecord) {
      this.req.session.userId = userRecord.id;
      await User.update({id: userRecord.id}).set({
        registerToken: ''
      });
      data = await UserType.find({forFirst: false}).populate('permissions');
      return exits.success({locals: data});
    } else {
      return exits.invalidOrExpiredToken();
    }

  }
};
