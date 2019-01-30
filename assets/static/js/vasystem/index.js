define(function (require) {
  var vas_api = require("../api/vas_api");
  return {
    mixins: [],
    data: {
      questionList: [],
      isAdmin: true,
      question: null,
    },
    beforeMount: function () {
      // Attach any initial data from the server.
      _.extend(this, SAILS_LOCALS);
      console.log(SAILS_LOCALS);
      this.questionList = this.locals.questions;
      this.isAdmin = this.me.isAdmin;
    },
    methods: {
      saveQuestion: function () {
        var self = this;
        var data = {content: this.question};
        vas_api.saveQuestion(data).then(function (payload) {
          self.updateQues(payload);
        });
      },
      showStatus: function (ques) {
        if (ques.answer != 0) {
          return 'Answered';
        } else {
          return 'Waiting';
        }
      },
      updateQues: function(payload) {
        this.questionList.push(payload);
      },
      userCreate: function(id) {
        console.log(id);
        if (this.me.id == id) {
          return true;
        } else {
          return false;
        }
      },
      quesDetail: function (ques) {
        console.log(ques.id);
        let url = '/detail?id='+ques.id;
        window.location = url;
      }
    }
  }
});
