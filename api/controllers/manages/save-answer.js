module.exports = {


  friendlyName: 'Save comment',


  description: '',


  inputs: {
    id: {
      type: 'string',
      defaultsTo: ''
    },
    content: {
      type: 'string',
      defaultsTo: ''
    },
  },
  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'The provided name or code are invalid.',
    }
  },


  fn: async function (inputs, exits) {

    let answer = {
      content: inputs.content,
      userId: this.req.me.id
    };

    var data = await Answer.create(answer).fetch();
    data.username = this.req.me.fullName;
    await Question.addToCollection(inputs.id, 'answers', data.id);
    return exits.success(data);

  }


};
