module.exports = {
  friendlyName: '',
  description: '',
  inputs: {
    clientip: {
      type: 'string',
      required: true
    },
    sendid: {
      type: 'string',
      default: ''
    },
    email: {
      type: 'string',
      required: true
    },
    user_name: {
      type: 'string',
      required: true
    },
    telno: {
      type: 'string',
      default: ''
    },
    money: {
      type: 'number',
      defaultsTo: 0
    },
    cont: {
      type: 'string',
      default: ''
    },
    rel: {
      type: 'string',
      default: ''
    },
    settle_count: {
      type: 'number',
      defaultsTo: 0
    },
    rebill_param_id: {
      type: 'string',
      default: ''
    }
  },
  exits: {
    not_found: {
      statusCode: 404,
      description: 'User is not exist'
    }
  },
  fn: async function (inputs, exits) {
    if (inputs.clientip === sails.config.custom.clientip) {
      if (inputs.rel === 'yes') {
        let user = {
          fullName: (" " + inputs.user_name).toLowerCase().replace(/[^a-zA-Z]+(.)/g, function (match) {
            return match.toUpperCase();
          }),
          emailAddress: inputs.email,
          emailStatus: 'confirmed',
          isSuperAdmin: false,
          telno: inputs.telno,
          sendid: inputs.sendid
        };
        if (inputs.sendid !== '') {
          console.log("Have sendid");
          const checkUser = await User.findOne({sendid: inputs.sendid});
          if (checkUser) {
            let data = await sails.helpers.checkPlan(inputs.rebill_param_id, inputs.money);
            let date = new Date();
            if (checkUser.expireDate >= date.getTime()) {
              user.expireDate = checkUser.expireDate + data.dayExpire;
            } else {
              user.expireDate = date.getTime() + data.dayExpire;
            }
            checkUser.userType = data.type;
            await User.update({id: checkUser.id}, user);
          } else {
            console.log("user not exits");
            let data = [];
            if (inputs.rebill_param_id !== '') {
              data = await sails.helpers.checkPlan(inputs.rebill_param_id, inputs.money);
            } else {
              data = await sails.helpers.checkPlan(inputs.rebill_param_id, inputs.money);
            }
            let date = new Date();
            let pass = Math.random().toString(36).substr(2, 8);
            user.userType = data.type;
            user.expireDate = date.getTime() + data.dayExpire;
            user.password = await sails.helpers.passwords.hashPassword(pass);

            var newUser = await User.create(user).fetch();
            var token = await sails.helpers.strings.random('url-friendly');
            await User.update({id: newUser.id}).set({
              passwordResetToken: token,
              passwordResetTokenExpiresAt: Date.now() + sails.config.custom.passwordResetTokenTTL,
            });
            await sails.helpers.sendTemplateEmail.with({
              to: newUser.emailAddress,
              subject: 'Password create instructions',
              template: 'email-create-password',
              templateData: {
                fullName: newUser.fullName,
                email: newUser.emailAddress,
                password: pass,
                token: token
              }
            });
          }
        } else {
          console.log("Don't have sendid");
          return exits.success({message: 'Error'});
        }
      } else {
        console.log("Confirm false");
        const checkUser = await User.findOne({sendid: inputs.sendid});
        if (checkUser) {
          var token = await sails.helpers.strings.random('url-friendly');
          await User.update({id: checkUser.id}).set({
            registerToken: token,
          });
          await sails.helpers.sendTemplateEmail.with({
            to: inputs.email,
            subject: 'Password create instructions',
            template: 'email-report-failed',
            templateData: {
              fullName: inputs.user_name,
              token: token,
              newUser: false
            }
          });
        } else {
          await sails.helpers.sendTemplateEmail.with({
            to: inputs.email,
            subject: 'Password create instructions',
            template: 'email-report-failed',
            templateData: {
              fullName: inputs.user_name,
              newUser: true
            }
          });
        }
      }
      return exits.success({message: 'SuccessOK'});
    } else {
      return exits.success({message: 'Error'});
    }
  }
};
