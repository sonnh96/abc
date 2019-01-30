module.exports.cron = {
  refreshPlan: {
    schedule: '00 00 3 * * *',
    onTick: async function () {
      var date = new Date();
      const types = await UserType.find().populate('permissions', {sort: 'id ASC'});
      var type = {};
      for (let i in types) {
        let t = types[i].permissions[0];
        if (t.id == sails.config.custom.viewonly_id) {
          type = types[i];
        }
      }
      const users = await User.find({expireDate: {'<': date, '!=': 0}});
      for (let i in users) {
        if (users[i].userType != type.id) {
          await User.update({id: users[i].id}).set({userType: type.id});
        }
      }
    },
    timezone: 'Asia/Tokyo'
  }
};
