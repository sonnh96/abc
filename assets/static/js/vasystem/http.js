define({
  fetch: function (url, method, data, options) {
    var ajax = _.clone({}, options);
    ajax.url = url;
    ajax.type = method;
    ajax.data = data;
    return new Promise(function (resolve, reject) {
      ajax.success = function (response) {
        resolve(response);
      };
      ajax.error = function (e) {
        reject(e);
      };
      $.ajax(ajax);
    });
  },
  get: function (url, options) {
    return this.fetch(url, 'GET', null, options);
  },
  post: function (url, data, options) {
    return this.fetch(url, 'POST', data, options);
  },
  put: function (url, options) {
    return this.fetch(url, 'PUT', null, options);
  },
  patch: function (url, options) {
    return this.fetch(url, 'PATCH', null, options);
  },
  delete: function (url, options) {
    return this.fetch(url, 'DELETE', null, options);
  }
});
