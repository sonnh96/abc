module.exports = {
  friendlyName: 'Test',
  description: 'Display "Login" page.',
  exits: {
    redirect: {
      description: 'The requesting user is already logged in.',
      responseType: 'redirect'
    }
  },
  fn: async function (inputs, exits) {
    let name = 'Security';
    let code = await Department.findNextId();
    console.log(code);
    var test = await Department.create({
      id: code.toString(),
      name: name
    }).intercept({name: 'UsageError'}, 'invalid').fetch();

    console.log(test);
    return exits.json({mess: 'ok'});
  }
};
