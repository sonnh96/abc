module.exports = {
  friendlyName: 'View edit settings',
  description: 'Display "Edit settings" page.',
  exits: {
    success: {
      viewTemplatePath: 'pages/account/edit-settings'
    }
  },
  fn: async function (inputs, exits) {
    // Respond with view.
    return exits.success({
      userConfig: await UserConfig.getByUserOrDefault(this.req.me.id)
    });
  }
};
