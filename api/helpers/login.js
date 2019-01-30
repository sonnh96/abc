module.exports = {
  friendlyName: 'Login',
  description: 'Login something.',
  inputs: {
    form: {
      type: 'ref',
      required: true
    }
  },
  exits: {
    success: {
      description: 'User success logged in.'
    },
    incorrect: {
      description: 'Wrong email address or password.'
    },
  },
  fn: async function (inputs, exits) {
    const form = inputs.form;
    const userRecord = await User.findOne({
      emailAddress: form.emailAddress.toLowerCase(),
    });
    if (!userRecord) {
      return exits.incorrect();
    }
    try {
      await sails.helpers.passwords.checkPassword(form.password, userRecord.password);
    } catch (e) {
      userRecord.loginAttempts = await User.increaseAttempt(userRecord.emailAddress);
      return exits.incorrect(userRecord);
    }
    return exits.success(userRecord);
  }
};

