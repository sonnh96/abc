define(['./http'], function (require) {
  return {
    proxyLoad: function (urlParams) {
      return http.post('/api/proxy', {url: urlParams});
    },
    loadStockExchangesData: function (lang) {
      return this.proxyLoad('listexch?lang=' + lang).then(function (response) {
        return response.map(function (e) {
          return {
            label: e.name + '( ' + e.code + ' )',
            value: e.code,
            stocks: []
          };
        });
      });
    },
    loadStocksByExchangeData: function (exchange, lang) {
      return this.proxyLoad('list?code=' + exchange.value + '&lang=' + lang).then(function (response) {
        return response.map(function (e) {
          return {
            label: e.Name + '( ' + e.Symbol + ' )',
            Currency: e.Currency,
            Name: e.Name,
            Symbol: e.Symbol,
            code_exchange: exchange.value
          };
        });
      });
    },
    loadSavedStock: function () {
      return http.post('/api/list_stock');
    },
    saveStock: function (stock) {
      return http.post('/api/add_stock', stock);
    },
    removeStock: function (stock) {
      return http.post('/api/remove_stock', {id: stock.id});
    },
    stockDetail: function (item, lang) {
      return this.proxyLoad('detail?code=' + item.Symbol + '.' + item.code_exchange + '&lang=' + lang);
    },
    //history
    dataPredictHistory: function (code, lang) {
      var url = 'history/prediction?code=' + code + '&lang=' + lang;
      return this.proxyLoad(url).then(function (response) {
        return response.content;
      });
    },
    chartDataPredictHistory: function (code, lang) {
      var url = 'history/data?code=' + code + '&lang=' + lang;
      return this.proxyLoad(url).then(function (response) {
        if (_.isString(response)) {
          throw response;
        }
        return response[0];
      });
    },
  };
});
