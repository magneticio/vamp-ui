/* global SmoothieChart, TimeSeries */
(function (exports) {
  var charts = {};
  var resetValueTimeout = 7500;
  var resetValueAfterLast = 5000;

  function TimeSeriesCharts() {
  }

  TimeSeriesCharts.chart = 'chart';
  TimeSeriesCharts.healthChart = 'health-chart';
  TimeSeriesCharts.sparkline = 'sparkline';
  TimeSeriesCharts.healthSparkline = 'shealth-parkline';

  var chartOptions = {
    maxValueScale: 1,
    interpolation: 'bezier',
    sharpLines: true,
    grid: {
      fillStyle: 'transparent',
      strokeStyle: '#37647D',
      millisPerLine: 10000,
      verticalSections: 4,
      borderVisible: true
    },
    labels: {
      fillStyle: '#b9c8d2',
      fontSize: 10,
      precision: 0
    },
    timestampFormatter: SmoothieChart.timeFormatter,
    minValue: 0,
    millisPerPixel: 100,
    maxDataSetLength: 8
  };

  var healthChartOptions = chartOptions;

  var sparklineOptions = {
    maxValueScale: 1,
    interpolation: 'bezier',
    sharpLines: true,
    borderVisible: false,
    grid: {
      fillStyle: 'transparent',
      strokeStyle: '#b3b3b3',
      millisPerLine: 10000,
      verticalSections: 4
    },
    minValue: 0,
    millisPerPixel: 330,
    labels: {
      disabled: true
    },
    timestampFormatter: function () {
      return '';
    },
    maxDataSetLength: 8
  };

  var healthSparklineOptions = sparklineOptions;

  var chartTimeSeriesOptions = {
    lineWidth: 3,
    strokeStyle: '#29719b',
    fillStyle: 'rgba(41, 113, 155, 0.4)'
  };

  var healthChartTimeSeriesOptions = {
    lineWidth: 3,
    strokeStyle: '#00ff00',
    fillStyle: 'rgba(0, 255, 0, 0.2)'
  };

  var sparklineTimeSeriesOptions = chartTimeSeriesOptions;

  var healthSparklineTimeSeriesOptions = healthChartTimeSeriesOptions;

  function merge() {
    var result = {};
    for (var i = 0; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          if (typeof (arguments[i][key]) === 'object') {
            if (arguments[i][key] instanceof Array) {
              result[key] = arguments[i][key];
            } else {
              result[key] = merge(result[key], arguments[i][key]);
            }
          } else {
            result[key] = arguments[i][key];
          }
        }
      }
    }
    return result;
  }

  TimeSeriesCharts.prototype.define = function (definitions) {
    this.invalidate();

    var remove = _.difference(_.map(charts, function (v, n) {
      return n;
    }), _.map(definitions, function (definition) {
      return definition.canvasId;
    }));

    _.forEach(remove, function (canvasId) {
      if (charts[canvasId]) {
        if (charts[canvasId].timeout) {
          clearTimeout(charts[canvasId].timeout);
        }
        if (charts[canvasId].chart) {
          charts[canvasId].chart.stop();
        }
        delete charts[canvasId];
      }
    });

    _.forEach(definitions, function (definition) {
      if (!charts[definition.canvasId]) {
        var co = chartOptions;
        var tso = chartTimeSeriesOptions;

        if (TimeSeriesCharts.healthChart === definition.type) {
          co = healthChartOptions;
          tso = healthChartTimeSeriesOptions;
        } else if (TimeSeriesCharts.sparkline === definition.type) {
          co = sparklineOptions;
          tso = sparklineTimeSeriesOptions;
        } else if (TimeSeriesCharts.healthSparkline === definition.type) {
          co = healthSparklineOptions;
          tso = healthSparklineTimeSeriesOptions;
        }

        co = merge(co, definition.chartOptions);
        tso = merge(tso, definition.timeSeriesOptions);

        var entry = charts[definition.canvasId] = {};
        entry.series = new TimeSeries();
        entry.chart = new SmoothieChart(co);
        entry.chart.addTimeSeries(entry.series, tso);
        entry.chart.streamTo(document.getElementById(definition.canvasId));
      }
    });
  };

  TimeSeriesCharts.prototype.append = function (id, timestamp, value, lasts) {
    timestamp = timestamp || Date.now();
    if (value !== null && value !== undefined) {
      lasts[id] = value;
      if (charts[id] && charts[id].series) {
        if (charts[id].tail < timestamp - resetValueTimeout) {
          charts[id].series.append(timestamp - resetValueTimeout, 0);
        }
        charts[id].series.append(timestamp, value);
      }
    }
    var promise = this.timeout(id, timestamp, lasts);
    if (promise) {
      promise.then(function () {
        lasts[id] = 'none';
      }).catch(function () {
      });
    }
  };

  TimeSeriesCharts.prototype.timeout = function (id, timestamp, lasts) {
    var $this = this;
    if (!charts[id]) {
      return;
    }
    var tail = charts[id].tail ? charts[id].tail < timestamp : true;
    return new Promise(function (resolve, reject) {
      if (tail) {
        clearTimeout(charts[id].timeout);
        charts[id].tail = timestamp;
        charts[id].timeout = setTimeout(function () {
          $this.append(id, timestamp + resetValueAfterLast, 0, lasts);
          resolve();
        }, resetValueTimeout);
      } else {
        reject();
      }
    });
  };

  TimeSeriesCharts.prototype.invalidate = function () {
    _.forEach(charts, function (entry) {
      if (entry.timeout) {
        clearTimeout(entry.timeout);
      }
      if (entry.chart) {
        entry.chart.stop();
      }
    });
    charts = {};
  };

  exports.TimeSeriesCharts = TimeSeriesCharts;
})(typeof exports === 'undefined' ? this : exports);
