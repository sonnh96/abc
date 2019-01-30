module.exports = {
  friendlyName: 'Update profile',
  description: 'Update the profile for the logged-in user.',
  inputs: {
    chartType: {
      type: 'string'
    },
  },
  fn: async function (inputs, exits) {
    const chartType = inputs.chartType;
    if (chartType) {
      const userConfig = await UserConfig.getByUserOrDefault(this.req.me.id);
      userConfig.chartType = chartType;
      if (userConfig.id) {
        await UserConfig.update({id: userConfig.id}, {chartType: chartType});
      } else {
        await UserConfig.create(userConfig);
      }
    }
    return exits.success();
  }
};
