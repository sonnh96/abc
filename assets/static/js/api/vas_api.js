define(['./http'], function (http) {
  return {
    saveQuestion: function (data) {
      return http.post('/api/v1/save_question', data);
    },
    showDetail: function (id) {
      var url = '/detail?id='+id;
      return http.get(url);
    },
    saveCom: function (data) {
      return http.post('/api/v1/save_comment', data);
    },
    saveAnswer: function (data) {
      return http.post('/api/v1/save_answer', data);
    }
  };
});
