const axios = require('axios');
const baseUrl = sails.config.custom.apiUrl;
module.exports = {


  friendlyName: 'Question details',


  description: '',


  inputs: {
    id: {
      type: 'string',
    },
  },


  exits: {
    success: {
      viewTemplatePath: 'pages/question-detail',
    },
    invalid: {
      responseType: 'badRequest',
      description: 'The provided name or code are invalid.',
    }
  },

  fn: async function (inputs, exits) {
    const question = await Question.findOne(inputs.id).populate(['comments', 'answers']);
    // console.log(question);
    for (let index in question.comments) {
      let user = await User.findOne(question.comments[index].userId);
      question.comments[index].username = user.fullName;
    }
    for (let index in question.answers) {
      let user = await User.findOne(question.answers[index].userId);
      question.answers[index].username = user.fullName;
    }
    let url =encodeURI( baseUrl + 'suggest?ques=' + inputs.content);
    const response = await axios.get(url).then(res => res.data);
    question.suggest = response;

    return exits.success({
      layout: 'layouts/empty',
      locals: question
    });

  }


};
