const clientip = sails.config.custom.clientip;
module.exports = {
  friendlyName: 'Active enduser',
  description: '',
  inputs: {
    id: {
      type: 'string',
      required: true
    },
    price: {
      type: 'number',
      required: true
    },
    rebill_param_id: {
      type: 'string'
    }
  },
  exits: {
    not_found: {
      statusCode: 404,
      description: 'User is not exist'
    }
  },
  fn: async function (inputs, exits) {
    var url = '';
    var param = {};
    if (inputs.price == 0) {
      url = sails.config.custom.credit_card_authentication;
      param = {clientip: clientip};
    } else {
      url = sails.config.custom.credit_receive_settlement;
      if (this.req.me && this.req.me.sendid != '') {
        param = {
          clientip: clientip,
          money: inputs.price,
          rebill_param_id: inputs.rebill_param_id,
          sendid: inputs.req.me.sendid
        };
      } else {
        param = {
          clientip: clientip,
          money: inputs.price,
          rebill_param_id: inputs.rebill_param_id
        };
      }
    }
    return exits.success({url: url, param: param});
  }
};
