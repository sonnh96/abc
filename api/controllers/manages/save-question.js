const axios = require('axios');
const baseUrl = sails.config.custom.apiUrl;
module.exports = {


  friendlyName: 'Save question',


  description: '',


  inputs: {
    content: {
      type: 'string',
    },
  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'The provided name or code are invalid.',
    }
  },


  fn: async function (inputs, exits) {
    let question = {
      content: inputs.content,
      userId: this.req.me.id
    };
    let url = baseUrl + 'classify?sen=' + inputs.content;
    const response = await axios.get(url).then(res => res.data);
    for (let i in response.department_ids) {
      response.department_ids[i] = response.department_ids[i].toString();
    }
    let department = response.department_ids;
    var data = await Question.create(question).fetch();

    const q = await Question.findOne({id: data.id}).populate('comments');
    data.comment = q.comments.length;
    const a = await Question.findOne({id: data.id}).populate('answers');
    data.answer = a.answers.length;
    data.createdBy = this.req.me.fullName;
    await Question.addToCollection(data.id, 'departments', department);

    return exits.success(data);

  }


};
