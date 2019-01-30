module.exports = {
  friendlyName: 'View account overview',
  description: 'Display "Account Overview" page.',
  exits: {
    success: {
      viewTemplatePath: 'pages/account/account-overview',
    }
  },
  fn: async function (inputs, exits) {
    if (!this.req.me.isSuperAdmin){
      const type = await UserType.find({id: this.req.me.userType}).populate('permissions');
      return exits.success({
        stripePublishableKey: sails.config.custom.enableBillingFeatures ? sails.config.custom.stripePublishableKey : undefined,
        userType: type
      });
    } else {
      return exits.success({
        stripePublishableKey: sails.config.custom.enableBillingFeatures ? sails.config.custom.stripePublishableKey : undefined,
      });
    }
  }
};
