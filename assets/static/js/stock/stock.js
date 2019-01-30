define(['../api/stock_api', './datetime_mx', './lang_mx', './stock_exchange_mx', './vue-table-localize'], function (stock_api, datetime_mx, lang_mx, stock_exchange_mx, table_localize) {
  return {
    mixins: [datetime_mx, lang_mx, stock_exchange_mx, table_localize],
    mounted: function () {
      var lang = this.obtainLangFromUI();
      var localized = this.tableTextLocalize[lang];
      if (localized) {
        this.table.options.texts = localized;
      }
    },
    data: function () {
      return {
        start_time: "",
        end_time: "",
        switchTime: 0,
        stock_item: {
          "Currency": "...",
          "Name": "...",
          "Symbol": "...",
          "CategoryOrIndustry": "...",
          "MarketIdentificationCode": "...",
          "Section": "...",
          "Exchange": "...",
          "Volume": 0,
          "Open": 0,
          "Close": 0,
          "Low": 0,
          "VWAP": 0,
          "High": 0
        },
        table: {
          columns: ['Currency', 'Name', 'Symbol'],
          options: {
            // see the options API
            headings: {
              'Currency': $('#Currency').html(),
              'Name': $('#Name').html(),
              'Symbol': $('#Symbol').html()
            },
            filterable: ['Name', 'Symbol'],
            sortIcon: {
              base: 'glyphicon',
              up: 'glyphicon-sort-by-attributes',
              down: 'glyphicon-sort-by-attributes-alt',
              is: 'glyphicon-sort'
            },
            texts: {}
          }
        },
        selectedStock: null,
        listStocksSaved: [],
        currentStock: null,
        stockSearchKey: null
      }
    },
    computed: {
      allStocks: function () {
        var self = this;
        var stocks = this.stockExchangeList.reduce(function (allStocks, exchange) {
          exchange.stocks.forEach(function (stock) {
            var previous = allStocks[stock.Symbol];
            if (!previous) {
              allStocks[stock.Symbol] = stock;
            } else if (self.compareStockExchange(stock.code_exchange, previous.code_exchange) > 0) {
              allStocks[stock.Symbol] = stock;
            }
          });
          return allStocks;
        }, {});
        return _.map(stocks, function (value) {
          return value;
        });
      },
      stockExchangeStockList: function () {
        if (this.currentStockExchange) {
          return this.currentStockExchange.stocks || [];
        }
        return [];
      },
      uiListStockSelect: function () {
        var searchKey = this.stockSearchKey;
        if (searchKey && searchKey.trim().length > 0) {
          return this.allStocks;
        }
        return this.stockExchangeStockList;
      },
      isActiveStock() {
        var selectedStock = this.currentStock;
        if (!selectedStock) {
          return function () {
            return false;
          }
        }
        return function (stock) {
          return stock.Symbol == selectedStock.Symbol && stock.code_exchange == selectedStock.code_exchange;
        }
      }
    },
    // Methods
    methods: {
      selectedStockDidChanged: function (val) {
        this.selectedStock = val;
        if (!val) {
          return;
        }
        if (!this.currentStockExchange || this.currentStockExchange.value != val.code_exchange) {
          this.currentStockExchange = _.find(this.stockExchangeList, function (ex) {
            return ex.value == val.code_exchange;
          })
        }
      },
      onBeginSearchStockWithKey: function (key) {
        this.stockSearchKey = key;
      },
      detailStock: function (item) {
        var self = this;
        self.switchTime = 1;
        $('#start_time').val(self.getDayLast());
        $('#end_time').val(self.getDayNow());
        self.currentStock = item;
        var lang = self.langCodeToFull(self.obtainLangFromUI());
        stock_api.stockDetail(item, lang).then(function (stock_item) {
          self.stock_item.Name = stock_item.Name;
          self.stock_item.CategoryOrIndustry = stock_item.CategoryOrIndustry;
          self.stock_item.Currency = stock_item.Currency;
          self.stock_item.Exchange = stock_item.Exchange;
          self.stock_item.MarketIdentificationCode = stock_item.MarketIdentificationCode;
          self.stock_item.Section = stock_item.Section;
          self.stock_item.Symbol = stock_item.Symbol;
          stock_api.proxyLoad('graph/days?code=' + item.Symbol + '.' + self.currentStockExchange.value
            + '&start=' + self.getDayLast()
            + '&end=' + self.getDayNow()).then(function (dates) {
            var length_items = dates.length;
            if (length_items > 0) {
              self.stock_item.Volume = dates[length_items - 1].Volume;
              self.stock_item.Close = dates[length_items - 1].Close;
              self.stock_item.Low = dates[length_items - 1].Low;
              self.stock_item.VWAP = dates[length_items - 1].VWAP;
              self.stock_item.High = dates[length_items - 1].High;
              self.stock_item.Open = dates[length_items - 1].Open;
            }
            self.getChartByCodeLong();
          });
        });
      },
      addStock: function () {
        var self = this;
        if (!self.selectedStock) {
          return;
        }
        self.selectedStockDidChanged(self.selectedStock);
        var item = self.selectedStock;
        if (item == null) {
          ns_master.toastr("Stock code does not exist", "error");
          return;
        }
        if (!item.code_exchange) {
          if (!self.currentStockExchange || self.currentStockExchange.value) {
            return;
          }
          item.code_exchange = self.currentStockExchange.value;
        }
        stock_api.saveStock(item).then(function () {
          self.get_list_stock_save(item);
        });
      },
      //Add Stock in view list
      addStockViewList: function (item) {
        var self = this;
        self.selectedStock = item;
        self.addStock();
      },
      //Remove Stock
      removeStock: function (item) {
        if (!confirm("Confirm?")) {
          return;
        }
        var self = this;
        stock_api.removeStock(item).then(function () {
          self.get_list_stock_save();
          if (self.isActiveStock(item)) {
            self.currentStock = null;
          }
        });
      },
      getChartByCode: function (type) {
        if (!type) {
          type = SWITCHTYPE_CHART;
        }
        var self = this;
        console.log(self.currentStockExchange.value, "AAAAA");
        console.log(self.stock_item.Symbol, "BBBBB");
        console.log(type, "CCCCC");
        if (!self.currentStockExchange.value) {
          return;
        }
        if (!self.stock_item.Symbol) {
          return;
        }
        if (SWITCHTIME != 2) {
          self.start_time = self.get2WorkingDayLast();
          self.end_time = self.getDayNowShort();
        }
        var lang = self.langCodeToFull(self.obtainLangFromUI());
        var options = {
          type: 'time',
          title: $('.btn-short-term').html(),
          url: ''
        };
        if (type === 'line') {
          $('#columnchart_material').hide();
          $('#chart').show();
          SWITCHTYPE_CHART = type;
          options.url = '/api/date_chart?code=' + self.stock_item.Symbol + '.' + self.currentStockExchange.value
            + '&type=minutes&start=' + self.start_time + '&end=' + self.end_time
            + '&lang=' + lang
            + '&step=' + 5;
          chartDrawer.loadChart(options);
        } else {
          $('#chart').hide();
          $('#columnchart_material').show();
          SWITCHTYPE_CHART = type;
          options.url = '/api/date_chart_column?code=' + self.stock_item.Symbol + '.' + self.currentStockExchange.value
            + '&type=minutes&start=' + self.start_time + '&end=' + self.end_time
            + '&lang=' + lang
            + '&step=' + 5;
          chartDrawer.loadChartCandleStick(options);
        }
        SWITCHTIME = 2;
      },
      getChartByCodeLong: function (type) {
        if (!type) {
          type = SWITCHTYPE_CHART;
        }
        var self = this;
        console.log(self.currentStockExchange.value, "AAAAA");
        console.log(self.stock_item.Symbol, "BBBBB");
        console.log(type, "CCCCC");
        if (!self.currentStockExchange.value) {
          return;
        }
        if (!self.stock_item.Symbol) {
          return;
        }
        var lang = self.langCodeToFull(self.obtainLangFromUI());
        var options = {
          type: 'date',
          title: $('.btn-long-term').html()
        };
        //Type chart line
        if (type == 'line') {
          $('#columnchart_material').hide();
          $('#chart').show();
          if (SWITCHTIME != 1 || SWITCHTYPE_CHART != 'line') {
            self.start_time = self.getDayLast();
            self.end_time = self.getDayNow();
          }
          SWITCHTYPE_CHART = type;
          $('#chart').html('');
          options.url = '/api/date_chart?code=' + self.stock_item.Symbol + '.' + self.currentStockExchange.value
            + '&type=days&start=' + self.start_time + '&end=' + self.end_time
            + '&lang=' + lang;
          chartDrawer.loadChart(options);
        }
        //Type chart column
        if (type == 'column') {
          $('#chart').hide();
          $('#columnchart_material').show();
          if (SWITCHTIME != 1 || SWITCHTYPE_CHART != 'column') {
            self.start_time = self.getDayLast();
            self.end_time = self.getDayNow();
          }
          SWITCHTYPE_CHART = type;
          options.url = '/api/date_chart_column?code=' + self.stock_item.Symbol + '.' + self.currentStockExchange.value
            + '&type=days&start=' + self.start_time + '&end=' + self.end_time
            + '&lang=' + lang;
          chartDrawer.loadChartCandleStick(options);
        }
        SWITCHTIME = 1;
        return;
      },
      getChartByCodeSelect: function (type) {
        if (type != 'line' && type != 'column') {
          type = SWITCHTYPE_CHART;
        }
        var self = this;
        switch (SWITCHTIME) {
          case 1:
            self.getChartByCodeLong(type);
            break;
          case 2:
            self.getChartByCode(type);
            break;
        }
      },
      setChartType: function (type) {
        var self = this;
        self.getChartByCodeSelect(type);
      },
      getTimeOutChart: function () {
        var self = this;
        if (SWITCHTIME == 2) {
          self.start_time = self.getDayLastShort();
          self.end_time = self.getDayNowShort();
          self.getChartByCodeSelect();
        }
        setTimeout(() => {
          self.getTimeOutChart();
        }, 300000);
      },
      show_list_stock: function () {
        $('#list_stock_modal').modal("show");
      },
      //load list stock save by code exchange
      get_list_stock_save: function (selectedItem) {
        var self = this;
        return stock_api.loadSavedStock().then(function (stocks) {
          self.listStocksSaved = stocks;
          if (selectedItem) {
            self.detailStock(selectedItem);
          }
          self.localizeSavedStock();
          return stocks;
        });
      },
      localizeSavedStock: function () {
        var self = this;
        var allStocks = self.allStocks;
        _.forEach(self.listStocksSaved, function (savedStock) {
          var found = _.find(allStocks, function (st) {
            return st.Symbol == savedStock.Symbol;
          });
          if (found) {
            savedStock.Name = found.Name;
            savedStock.Currency = found.Currency;
            savedStock.label = found.label;
          }
        });
      }
    },
    //Load begin list stock
    created: function () {
      var self = this;
      var localizeSavedStock = this.localizeSavedStock.bind(this);
      this.$once('stock_exchange:ready', function () {
        var lang = self.langCodeToFull(self.obtainLangFromUI());
        var tasks = self.stockExchangeList.map(function (exchange) {
          return stock_api.loadStocksByExchangeData(exchange, lang).then(function (stocks) {
            exchange.stocks = stocks;
          }).then(localizeSavedStock);
        });
        Promise.all(tasks).then(localizeSavedStock).catch(localizeSavedStock);
      });
      this.get_list_stock_save();
      this.getTimeOutChart();

      var stockRangChanged = function (ev) {
        self.start_time = ev.detail.start;
        self.end_time = ev.detail.end;
      };
      document.addEventListener('chart-range--changed', stockRangChanged);
      this.$once('destroyed', function () {
        document.removeEventListener('chart-range--changed', stockRangChanged);
      })
    },
  }
});
