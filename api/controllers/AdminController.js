async function page(res, template, locals) {
  const type = await UserType.find();
  var data = [];

  let total = {};
  total.total = await User.count();
  if (locals.lang.code == 'ja') {
    total.name = '登録';
  } else {
    total.name = 'Total';
  }
  data.push(total);

  for (var i = 0; i < type.length; i++) {
    let d = type[i];
    d.total = await User.count({userType: type[i].id});
    data.push(d);
  }

  let admin = {};
  admin.total = await User.count({isSuperAdmin: true});
  if (locals.lang.code == 'ja') {
    admin.name = '無期契約';
  } else {
    admin.name = 'Admin';
  }
  data.push(admin);

  locals.userData = data;
  return res.view(`pages/admin/manages/${template}`, {
    layout: 'layouts/admin-layout',
    locals: locals
  });
}

async function appConfigs() {
  const configs = await GlobalConfig.find({});
  return configs.reduce((combined, config) => {
    combined[config.id] = config.value;
    return combined;
  }, {});
}

module.exports = {
  async userManager(req, res) {
    const attributes = User.attributes;
    const users = await User.find().then((users) => {
      return users.map(function (user) {
        user = _.extend({}, user);
        for (let attrName in attributes) {
          if (attributes[attrName].protect) {
            delete user[attrName];
          }
        }
        delete user.password;
        return user;
      });
    });
    const configs = await appConfigs();
    const userTypes = await UserType.find().populate('permissions', {sort: 'id ASC'});
    return await page(res, 'user-manager', {
      userList: users,
      appConfigs: configs,
      userTypes: userTypes,
      lang: req.currentLanguage
    });
  },
  async typeManager(req, res) {
    const userTypes = await UserType.find().populate('permissions');
    const permissions = await UserPermission.find();
    const configs = await appConfigs();
    return await page(res, 'type-manager', {
      userTypes: userTypes,
      permissionList: permissions,
      appConfigs: configs,
      lang: req.currentLanguage
    });
  },
  async permissionManager(req, res) {
    const permissions = await UserPermission.find();
    return await page(res, 'permission-manager', {
      permissionList: permissions,
      lang: req.currentLanguage
    });
  },
  async viewAgreements(req, res) {
    const agreements = await TermAgreement.find({sort: ['order DESC', 'createdAt ASC']});
    return await page(res, 'terms-agreement-revision', {
      agreements: agreements,
      lang: req.currentLanguage
    });
  }
};
