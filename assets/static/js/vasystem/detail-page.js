define(function (require) {
  var vas_api = require("../api/vas_api");
  return {
    mixins: [],
    data: {
      question: null,
      questionId: null,
      isAdmin: null,
      comments: [],
      answers: [],
      suggest: [],
      comm: null,
      ans: null
    },
    beforeMount: function () {
      // Attach any initial data from the server.
      _.extend(this, SAILS_LOCALS);
      console.log(SAILS_LOCALS);
      this.question = this.locals.content;
      this.questionId = this.locals.id;
      this.comments = this.locals.comments;
      this.suggest = this.locals.suggest;
      this.answers = this.locals.answers;
      this.isAdmin = this.locals.me.isAdmin;
    },
    methods: {
      saveComment: function () {
        var self = this;
        var data = {id: this.questionId, content: this.comm};
        vas_api.saveCom(data).then(function (payload) {
          console.log(payload);
          self.updateComment(payload);
        });
      },
      saveAnswer: function() {
        var self = this;
        var data = {id: this.questionId, content: this.ans};
        vas_api.saveAnswer(data).then(function (payload) {
          self.updateAnswer(payload);
        });
      },
      updateComment: function(payload){
        this.comments.push(payload);
      },
      updateAnswer: function(payload){
        this.answers.push(payload);
      },
      prettyDate: function (date) {
        pad = function (val, len) {
          val = String(val);
          len = len || 2;
          while (val.length < len) val = "0" + val;
          return val;
        };
        let html = "";
        var a = new Date(date);
        html += pad(a.getHours()) + ":" + pad(a.getMinutes())
          + " " + a.getFullYear() + "-" + pad(a.getMonth() + 1) + "-" + pad(a.getDate());
        return html;
      },
      showStatus: function (ques) {
        if (ques.answer != 0) {
          return 'Answered';
        } else {
          return 'Waiting';
        }
      },
      quesDetail: function (ques) {
        console.log(ques.id);
        vas_api.showDetail(ques.id).then(function (payload) {
          console.log(payload);
          $('#main-content').empty();
          $('#main-content').append(payload);
        });
      }
    }
  }
});
