var workingDateRange = (function () {
  var WEEK_DAY = 7;
  var SUN = 0;
  var MON = 1;
  var TUE = 2;
  var WED = 3;
  var THU = 4;
  var FRI = 5;
  var SAT = 6;

  function verifyWeekendDays(nums) {
    return nums.filter(function (value, index, self) {
      return self.indexOf(value) === index;
    });
  }

  function isWeekendDate(date, weekendDays) {
    var dayOfWeek = date.getDay();
    return weekendDays.some(function (d) {
      return dayOfWeek === d;
    });
  }

  function nearestPrevWorkingDate(date, weekendDays) {
    var targetDay = new Date(date.getTime());
    while (isWeekendDate(targetDay, weekendDays)) {
      targetDay.setDate(targetDay.getDate() - 1);
    }
    return targetDay;
  }

  function nearestNextWorkingDate(date, weekendDays) {
    var targetDay = new Date(date.getTime());
    while (isWeekendDate(targetDay, weekendDays)) {
      targetDay.setDate(targetDay.getDate() + 1);
    }
    return targetDay;
  }

  function workingDateRange(pivotDate, range, options) {
    options = options || {};
    var weekendDays = verifyWeekendDays((options.weekends || [SUN, SAT]));
    if (weekendDays.length >= WEEK_DAY) {
      throw 'No working days';
    }
    var isStartWorkingDay = !isWeekendDate(pivotDate, weekendDays);
    var workingDaysPerWeek = WEEK_DAY - weekendDays.length;
    if (isStartWorkingDay) {
      range--;
    }
    var weekCount = Math.floor(range / workingDaysPerWeek);
    var dayLeft = Math.max(0, range - weekCount * workingDaysPerWeek);
    var targetDay;
    if (isStartWorkingDay) {
      targetDay = new Date(pivotDate.getTime());
    } else {
      if (options.findNext) {
        targetDay = nearestNextWorkingDate(new Date(pivotDate.getTime()), weekendDays);
      } else {
        targetDay = nearestPrevWorkingDate(new Date(pivotDate.getTime()), weekendDays);
      }
    }
    if (options.findNext) {
      targetDay.setDate(targetDay.getDate() + WEEK_DAY * weekCount);
      while (dayLeft > 0) {
        targetDay.setDate(targetDay.getDate() + 1);
        if (!isWeekendDate(targetDay, weekendDays)) {
          dayLeft--;
        }
      }
      return [pivotDate, targetDay];
    } else {
      targetDay.setDate(targetDay.getDate() - WEEK_DAY * weekCount);
      while (dayLeft > 0) {
        targetDay.setDate(targetDay.getDate() - 1);
        if (!isWeekendDate(targetDay, weekendDays)) {
          dayLeft--;
        }
      }
      return [targetDay, pivotDate];
    }
  }

  workingDateRange.SUN = SUN;
  workingDateRange.MON = MON;
  workingDateRange.TUE = TUE;
  workingDateRange.WED = WED;
  workingDateRange.THU = THU;
  workingDateRange.FRI = FRI;
  workingDateRange.SAT = SAT;
  return workingDateRange;
})();

var chartDrawer = (function ($, d3, _) {
  var exports = {};

  var language = $('#current_language_code').val() || 'ja';
  if (language === 'ja') {
    Plotly.setPlotConfig({locale: 'ja'});
  }

  var localizedChartLabels = function () {
    var languages = {
      en: {
        high: 'High',
        low: 'Low',
        close: 'Close',
        open: 'Open',
        vwap: 'VWAP',
        volume: 'Volume',
        strings: {
          date: 'Date',
          time: 'Time'
        },
        step: 'Step'
      },
      ja: {
        high: '高値',
        low: '安値',
        close: '終値',
        open: '始値',
        vwap: 'VWAP',
        volume: 'Volume',
        strings: {
          date: 'Date',
          time: 'Time'
        },
        step: 'ステップ'
      }
    };
    return languages[language] || languages.en;
  };
  var localizedLabels = localizedChartLabels();

  var rangesArrayMaker = function (ranges) {
    var re = /^(\d+)([wdmy])$/;
    var rangeCalc = function (type) {
      var matches = type.match(re);
      if (matches.length !== 3) {
        return;
      }
      var offset = parseInt(matches[1]);
      type = matches[2];
      var extManipulate = (function (type) {
        switch (type) {
          case 'd':
            return function (ext) {
              ext.setDate(ext.getDate() - offset);
              return ext;
            };
          case 'w':
            return function (ext) {
              ext.setDate(ext.getDate() - offset * 7);
              return ext;
            };
          case 'm':
            return function (ext) {
              ext.setMonth(ext.getMonth() - offset);
              return ext;
            };
          case 'y':
            return function (ext) {
              ext.setFullYear(ext.getFullYear() - offset);
              return ext;
            };
        }
      })(type);
      return function (today) {
        today = new Date(today);
        var ext = new Date(today);
        ext = extManipulate(ext);
        return [today, ext];
      };
    };

    var translateLabel = function (type) {
      if (language === 'en') {
        return type;
      }
      var matches = type.match(re);
      if (matches.length !== 3) {
        return;
      }
      var offset = parseInt(matches[1]);
      type = matches[2];
      switch (type) {
        case 'd':
          return offset + '日';
        case 'w':
          return offset + '周';
        case 'm':
          return offset + 'か月';
        case 'y':
          return offset + '年';
      }
    };

    return ranges.map(function (type) {
      return {
        type: type,
        title: translateLabel(type),
        range: rangeCalc(type)
      }
    });
  };

  var stepsArrayMaker = function (steps) {

    var re = /^(\d+)([dhms])$/;

    var stepCalc = function (step) {
      var matches = step.match(re);
      if (matches.length !== 3) {
        return;
      }
      var offset = parseInt(matches[1]);
      step = matches[2];
      var ratio = 1;
      if (step === 'd') {
        ratio = 24 * 60 * 60;
      }
      if (step === 'h') {
        ratio = 60 * 60;
      } else if (step === 'm') {
        ratio = 60;
      }
      return offset * ratio;
    };

    var translateLabel = function (step) {
      if (language === 'en') {
        return step;
      }
      var matches = step.match(re);
      if (matches.length !== 3) {
        return;
      }
      var offset = parseInt(matches[1]);
      step = matches[2];
      switch (step) {
        case 'd':
          return offset + '日間';
        case 'h':
          return offset + '時足';
        case 'm':
          return offset + '分足';
        case 's':
          return offset + '秒';
      }
    };

    return steps.map(function (step) {
      return {
        step: step,
        title: translateLabel(step),
        value: stepCalc(step)
      }
    });
  };

  var workingDayRangesArrayMaker = function (ranges) {
    var re = /^(\d+)([d])$/;
    var rangeCalc = function (type) {
      var matches = type.match(re);
      if (matches.length !== 3) {
        return;
      }
      var offset = parseInt(matches[1]);
      return function (today) {
        today = new Date(today);
        return [today, workingDateRange(today, offset)[0]];
      };
    };

    var translateLabel = function (type) {
      if (language === 'en') {
        return type;
      }
      var matches = type.match(re);
      if (matches.length !== 3) {
        return;
      }
      var offset = parseInt(matches[1]);
      return offset + '日';
    };

    return ranges.map(function (type) {
      return {
        type: type,
        title: translateLabel(type),
        range: rangeCalc(type)
      }
    });
  };

  var longChartRangeSelections = rangesArrayMaker(['1w', '1m', '6m', '1y', '10y']);
  var shortChartRangeSelections = workingDayRangesArrayMaker(['1d', '2d', '3d', '4d', '5d']);
  var chartStepSelection = stepsArrayMaker(['1m', '5m']);

  var createUri = (function () {
    function SimpleUri(url) {
      this.url = url;

      this.path = null;
      this.queries = {};
    }

    var proto = SimpleUri.prototype;
    proto.toString = function () {
      if (!this.path) {
        return this.url;
      }
      if (Object.keys(this.queries).length === 0) {
        return this.path;
      }
      var queries = this.queries;
      return this.path + '?' + Object.keys(queries).map(function (key) {
        return key + '=' + queries[key];
      }).join('&');
    };

    proto.set = function (key, value) {
      if (!this.path) {
        var components = this.url.split('?');
        this.path = components[0];
        if (components.length > 1) {
          this.queries = components[1].split('&').reduce(function (queries, next) {
            var components = next.split('=');
            queries[components[0]] = components[1] || '';
            return queries;
          }, {});
        }
      }
      if (value !== null && value !== undefined) {
        this.queries[key] = value;
      } else {
        delete this.queries[key];
      }
    };

    return function (url) {
      return new SimpleUri(url);
    };
  })();

  function rangeHandlerSetup(legend, chatLoadOptions, callable) {
    var isLoadTime = chatLoadOptions.type === 'time';

    var ranges = isLoadTime ? shortChartRangeSelections : longChartRangeSelections;
    var rangeSelection = legend.append('g')
      .attr('class', 'chart__range-selection')
      .attr('transform', 'translate(110, 0)');
    var offsetUnit = 0;
    var i;
    var l = ranges.length;
    var v;
    for (i = 0; i < l; i++) {
      v = ranges[i];
      (function (v) {
        rangeSelection.append('text')
          .attr('class', 'chart__range-selection')
          .text(v.title)
          .attr('transform', 'translate(' + (offsetUnit * 9 + i * 2) + ', 0)')
          .on('click', function () {
            focusOnRange(v.range);
          });
        offsetUnit += Math.max(v.title.length, 2);
      })(v);
    }

    if (isLoadTime) {
      var offset = ranges.map(function (r) {
        return Math.max(r.title.length, 2);
      }).reduce(function (total, next) {
        return total + next;
      }, 0) * 9 + (ranges.length - 1) * 2 + 110 + 10;
      legend.append('text')
        .attr('transform', 'translate(' + offset + ', 0)')
        .text(localizedLabels.step + ':');
      offset += (localizedLabels.step + ':').length * (language === 'en' ? 5 : 9);
      var stepSelection = legend.append('g')
        .attr('class', 'chart__step-selection')
        .attr('transform', 'translate(' + offset + ', 0)');
      offsetUnit = 0;
      l = chartStepSelection.length;
      for (i = 0; i < l; i++) {
        v = chartStepSelection[i];
        (function (v) {
          stepSelection.append('text')
            .attr('class', 'chart__step-selection')
            .text(v.title)
            .attr('transform', 'translate(' + (offsetUnit * 9 + i * 2) + ', 0)')
            .on('click', function () {
              focusOnStep(v.value);
            });
          offsetUnit += Math.max(v.title.length, 2);
        })(v);
      }
    }

    function focusOnRange(rangeMaker) {
      function prettyNum(num) {
        if (num < 10) {
          return '0' + num;
        }
        return '' + num;
      }

      function format(datetime) {
        var dtStr = datetime.getFullYear() + '/' + prettyNum(datetime.getMonth() + 1) + '/' + prettyNum(datetime.getDate());
        if (isLoadTime) {
          dtStr += ' ' + prettyNum(datetime.getHours()) + ':' + prettyNum(datetime.getMinutes()) + ':' + prettyNum(datetime.getSeconds());
        }
        return dtStr;
      }

      var range = rangeMaker((new Date()).getTime());
      var end = format(range[0]);
      var start = range[1];
      start.setHours(8, 0, 0);
      start = format(start);
      var uri = createUri(chatLoadOptions.url);
      uri.set('start', start);
      uri.set('end', end);
      chatLoadOptions.url = uri.toString();
      callable(chatLoadOptions);
      var event = new CustomEvent('chart-range--changed', {
        detail: {
          start: start,
          end: end
        }
      });
      document.dispatchEvent(event);
    }

    function focusOnStep(seconds) {
      var minutes = Math.max(1, Math.round(seconds / 60));
      var uri = createUri(chatLoadOptions.url);
      uri.set('step', minutes);
      chatLoadOptions.url = uri.toString();
      callable(chatLoadOptions);
    }
  }

  function loadChart(chatLoadOptions) {
    var isLoadTime = chatLoadOptions.type === 'time';
    var $chart = $('#chart');
    $chart.html('');
    var width_chart = $chart.width();
    var margin = {top: 30, right: 10, bottom: 100, left: 0},
      margin2 = {top: 210, right: 10, bottom: 20, left: 0},
      width = width_chart - margin.left - margin.right,
      height = 283 - margin.top - margin.bottom,
      height2 = 283 - margin2.top - margin2.bottom;

    var dateFormat = isLoadTime ? '%d/%m/%Y %H:%M:%S' : '%d/%m/%Y';
    var parseDate = d3.time.format(dateFormat).parse,
      bisectDate = d3.bisector(function (d) {
        return d.date;
      }).left,
      legendFormat = d3.time.format(dateFormat);

    var x = d3.time.scale().range([0, width]),
      x2 = d3.time.scale().range([0, width]),
      y = d3.scale.linear().range([height, 0]),
      y1 = d3.scale.linear().range([height, 0]),
      y2 = d3.scale.linear().range([height2, 0]),
      y3 = d3.scale.linear().range([60, 0]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom'),
      xAxis2 = d3.svg.axis().scale(x2).orient('bottom'),
      yAxis = d3.svg.axis().scale(y).orient('left');

    var priceLine = d3.svg.line()
      .interpolate('monotone')
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.price);
      });

    var avgLine = d3.svg.line()
      .interpolate('monotone')
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.average);
      });

    var area2 = d3.svg.area()
      .interpolate('monotone')
      .x(function (d) {
        return x2(d.date);
      })
      .y0(height2)
      .y1(function (d) {
        return y2(d.price);
      });

    var svg = d3.select('#chart').append('svg')
      .attr('class', 'chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom + 60);

    svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);

    var make_y_axis = function () {
      return d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(3);
    };

    var focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var barsGroup = svg.append('g')
      .attr('class', 'volume')
      .attr('clip-path', 'url(#clip)')
      .attr('transform', 'translate(' + margin.left + ',' + (margin.top + 60 + 20) + ')');

    var context = svg.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + margin2.left + ',' + (margin2.top + 60) + ')');

    var legend = svg.append('g')
      .attr('class', 'chart__legend')
      .attr('width', width)
      .attr('height', 30)
      .attr('transform', 'translate(' + margin2.left + ', 10)');

    legend.append('text')
      .attr('class', 'chart__symbol')
      .text(chatLoadOptions.title);

    function type(d) {
      return {
        date: parseDate(d.Date),
        price: +d.Close,
        average: +d.Average,
        volume: +d.Volume,
      }
    }

    d3.csv(chatLoadOptions.url, type, function (err, data) {
      var brush = d3.svg.brush()
        .x(x2)
        .on('brush', brushed);

      var xRange = d3.extent(data.map(function (d) {
        return d.date;
      }));

      x.domain(xRange);
      y.domain(d3.extent(data.map(function (d) {
        return d.price;
      })));
      y3.domain(d3.extent(data.map(function (d) {
        return d.price;
      })));
      x2.domain(x.domain());
      y2.domain(y.domain());

      var min = d3.min(data.map(function (d) {
        return d.price;
      }));
      var max = d3.max(data.map(function (d) {
        return d.price;
      }));

      var range = legend.append('text')
        .text(legendFormat(new Date(xRange[0])) + ' - ' + legendFormat(new Date(xRange[1])))
        .style('text-anchor', 'end')
        .attr('transform', 'translate(' + width + ', 0)');

      focus.append('g')
        .attr('class', 'y chart__grid')
        .call(make_y_axis()
          .tickSize(-width, 0, 0)
          .tickFormat(''));

      var averageChart = focus.append('path')
        .datum(data)
        .attr('class', 'chart__line chart__average--focus line')
        .attr('d', avgLine);

      var priceChart = focus.append('path')
        .datum(data)
        .attr('class', 'chart__line chart__price--focus line')
        .attr('d', priceLine);

      focus.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0 ,' + height + ')')
        .call(xAxis);

      focus.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(12, 0)')
        .call(yAxis);

      var focusGraph = barsGroup.selectAll('rect')
        .data(data)
        .enter().append('rect')
        .attr('class', 'chart__bars')
        .attr('x', function (d, i) {
          return x(d.date);
        })
        .attr('y', function (d) {
          return 155 - y3(d.price);
        })
        .attr('width', 1)
        .attr('height', function (d) {
          return y3(d.price);
        });

      var helper = focus.append('g')
        .attr('class', 'chart__helper')
        .style('text-anchor', 'end')
        .attr('transform', 'translate(' + width + ', 0)');

      var helperText = helper.append('text');

      var priceTooltip = focus.append('g')
        .attr('class', 'chart__tooltip--price')
        .append('circle')
        .style('display', 'none')
        .attr('r', 2.5);

      var averageTooltip = focus.append('g')
        .attr('class', 'chart__tooltip--average')
        .append('circle')
        .style('display', 'none')
        .attr('r', 2.5);

      var mouseArea = svg.append('g')
        .attr('class', 'chart__mouse')
        .append('rect')
        .attr('class', 'chart__overlay')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .on('mouseover', function () {
          helper.style('display', null);
          priceTooltip.style('display', null);
          averageTooltip.style('display', null);
        })
        .on('mouseout', function () {
          helper.style('display', 'none');
          priceTooltip.style('display', 'none');
          averageTooltip.style('display', 'none');
        })
        .on('mousemove', mousemove);

      context.append('path')
        .datum(data)
        .attr('class', 'chart__area area')
        .attr('d', area2);

      context.append('g')
        .attr('class', 'x axis chart__axis--context')
        .attr('y', 0)
        .attr('transform', 'translate(0,' + (height2 - 22) + ')')
        .call(xAxis2);

      context.append('g')
        .attr('class', 'x brush')
        .call(brush)
        .selectAll('rect')
        .attr('y', -6)
        .attr('height', height2 + 7);

      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisectDate(data, x0, 1);
        var d0 = data[i - 1];
        var d1 = data[i];
        var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        var info = legendFormat(new Date(d.date)) + ' - '
          + localizedLabels.close + ': ' + d.price + ' '
          + localizedLabels.vwap + ': ' + d.average;
        helperText.text(info);
        priceTooltip.attr('transform', 'translate(' + x(d.date) + ',' + y(d.price) + ')');
        averageTooltip.attr('transform', 'translate(' + x(d.date) + ',' + y(d.average) + ')');
      }

      function brushed() {
        var ext = brush.extent();
        if (!brush.empty()) {
          x.domain(brush.empty() ? x2.domain() : brush.extent());
          y.domain([
            d3.min(data.map(function (d) {
              return (d.date >= ext[0] && d.date <= ext[1]) ? d.price : max;
            })),
            d3.max(data.map(function (d) {
              return (d.date >= ext[0] && d.date <= ext[1]) ? d.price : min;
            }))
          ]);
          range.text(legendFormat(new Date(ext[0])) + ' - ' + legendFormat(new Date(ext[1])));
          focusGraph.attr('x', function (d, i) {
            return x(d.date);
          });

          var days = Math.ceil((ext[1] - ext[0]) / (24 * 3600 * 1000));
          focusGraph.attr('width', (40 > days) ? (40 - days) * 5 / 6 : 5)
        }

        priceChart.attr('d', priceLine);
        averageChart.attr('d', avgLine);
        focus.select('.x.axis').call(xAxis);
        focus.select('.y.axis').call(yAxis);
      }

      rangeHandlerSetup(legend, chatLoadOptions, loadChart);
    })// end Data
  }

  function loadChartCandleStick(chatLoadOptions) {
    var isLoadTime = chatLoadOptions.type === 'time';

    function drawChart(data) {
      var layout = {
        dragmode: 'zoom',
        margin: {
          r: 10,
          t: 25,
          b: 40,
          l: 60
        },
        showlegend: false,
        xaxis: {
          autorange: true,
          domain: [0, 1],
          title: 'Time',
          type: 'date'
        },
        yaxis: {
          autorange: true,
          domain: [0.28, 1],
          type: 'linear'
        },
        xaxis2: {
          autorange: true,
          domain: [0, 1],
          title: 'Time',
          type: 'date',
          anchor: 'y2'
        },
        yaxis2: {
          autorange: true,
          domain: [0, 0.2],
          type: 'linear',
          anchor: 'x2'
        },
        xaxis3: {
          autorange: true,
          domain: [0, 1],
          title: 'Time',
          type: 'date',
          anchor: 'y3'
        },
        yaxis3: {
          autorange: true,
          domain: [0, 0.1],
          type: 'linear',
          anchor: 'x3'
        }
      };
      $('#columnchart_material').html('');
      Plotly.newPlot('columnchart_material', data, layout);
      //<editor-fold desc="Chart legend">
      var $svgContainer = $('#columnchart_material .svg-container');
      var width = $svgContainer.width();
      var svg = d3.select('#columnchart_material .svg-container').insert('svg', '.gl-container')
        .attr('class', 'chart')
        .attr('width', width)
        .attr('style', 'position: absolute;')
        .attr('height', 30);

      var legend = svg.append('g')
        .attr('class', 'chart__legend')
        .attr('width', width)
        .attr('height', 30)
        .attr('transform', 'translate(10,15)');

      legend.append('text')
        .attr('class', 'chart__symbol')
        .text(chatLoadOptions.title);
      rangeHandlerSetup(legend, chatLoadOptions, loadChartCandleStick);
    }

    var parseDate = d3.time.format('%d/%m/%Y').parse;
    var parseTime = d3.time.format('%d/%m/%Y %H:%M:%S').parse;

    function stockCandleStickData(items) {
      return _.reduce(items, function (combined, item) {
        combined.high.push(item.High);
        combined.low.push(item.Low);
        combined.close.push(item.Close);
        combined.open.push(item.Open);
        if (isLoadTime) {
          combined.x.push(parseTime(item.Date));
        } else {
          combined.x.push(parseDate(item.Date));
        }
        return combined;
      }, {
        x: [],
        high: [],
        low: [],
        close: [],
        open: []
      });
    }

    function stockVolumeData(items) {
      return _.reduce(items, function (combined, item) {
        if (isLoadTime) {
          combined.x.push(parseTime(item.Date));
        } else {
          combined.x.push(parseDate(item.Date));
        }
        combined.y.push(item.Volume);
        return combined;
      }, {
        x: [],
        y: []
      });
    }

    function stockVWAPData(items) {
      return _.reduce(items, function (combined, item) {
        if (isLoadTime) {
          combined.x.push(parseTime(item.Date));
        } else {
          combined.x.push(parseDate(item.Date));
        }
        combined.y.push(item.VWAP);
        return combined;
      }, {
        x: [],
        y: []
      });
    }

    function prepareData(json) {
      var text = _.map(json.items, function (item) {
        var delta = item.Close - item.Open;
        var text = [
          localizedLabels.open + ': ' + item.Open,
          localizedLabels.high + ': ' + item.High,
          localizedLabels.low + ': ' + item.Low,
          localizedLabels.close + ': ' + item.Close + ' ' + (delta === 0 ? '' : delta < 0 ? '▼' : '▲'),
          localizedLabels.vwap + ': ' + item.VWAP,
          localizedLabels.volume + ': ' + item.Volume,
          item.Date
        ];
        return text.join('<br>');
      });
      var trace1 = stockCandleStickData(json.items);
      trace1 = _.extend(trace1, {
        type: 'candlestick',
        xaxis: 'x',
        yaxis: 'y1',
        hoverinfo: 'text',
        text: text,
        increasing: {line: {color: '#00ff7a', width: 1}},
        decreasing: {line: {color: '#ff5f00', width: 1}}
      });
      var trace2 = stockVolumeData(json.items);
      trace2 = _.extend(trace2, {
        type: 'bar',
        hoverinfo: 'text',
        text: text,
        xaxis: 'x',
        yaxis: 'y2',
        marker: {
          color: '#fe7f0c'
        }
      });
      var trace3 = stockVWAPData(json.items);
      trace3 = _.extend(trace3, {
        type: 'bar',
        hoverinfo: 'text',
        text: text,
        xaxis: 'x',
        yaxis: 'y3',
        marker: {
          color: '#fe7f0c'
        }
      });
      return [trace1, trace2, trace3];
    }

    $.ajax({
      type: 'GET',
      url: chatLoadOptions.url,
      data: {},
      success: function (json) {
        drawChart(prepareData(json));
      }
    });
  }

  exports.loadChart = loadChart;
  exports.loadChartCandleStick = loadChartCandleStick;
  return exports;
})(jQuery, d3, _);
