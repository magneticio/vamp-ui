/* global SmoothieChart, TimeSeries */
(function (exports) {
  var charts = {};
  var timeoutTasks = {};
  var creationTimestamp = new Date().getTime();

  var resetValueTimeout = 7500;

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
    fillStyle: 'rgba(0, 255, 0, 0.4)'
  };

  var sparklineTimeSeriesOptions = chartTimeSeriesOptions;

  var healthSparklineTimeSeriesOptions = healthChartTimeSeriesOptions;

  TimeSeriesCharts.prototype.define = function (definitions) {
    var remove = _.difference(_.map(charts, function (v, n) {
      return n;
    }), _.map(definitions, function (definition) {
      return definition.canvasId;
    }));

    _.forEach(remove, function (canvasId) {
      if (charts[canvasId]) {
        if (timeoutTasks[canvasId]) {
          clearTimeout(timeoutTasks[canvasId]);
        }
        if (charts[canvasId].chart) {
          charts[canvasId].chart.stop();
        }
        delete charts[canvasId];
      }
    });

    var added = [];

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

        var entry = charts[definition.canvasId] = {};
        entry.series = new TimeSeries();
        entry.chart = new SmoothieChart(co);
        entry.chart.addTimeSeries(entry.series, tso);
        entry.chart.streamTo(document.getElementById(definition.canvasId));
        added.push(definition.canvasId);
      }
    });

    return {removed: remove, added: added};
  };

  TimeSeriesCharts.prototype.append = function (id, timestamp, value) {
    if (charts[id] && charts[id].series) {
      charts[id].series.append(timestamp, value);
    }
  };

  TimeSeriesCharts.prototype.timeout = function (id, timestamp) {
    var $this = this;
    var old = creationTimestamp - timestamp > resetValueTimeout;
    if (!old && timeoutTasks[id] !== null) {
      clearTimeout(timeoutTasks[id]);
    }
    return new Promise(function (resolve, reject) {
      if (old) {
        reject();
      } else {
        timeoutTasks[id] = setTimeout(function () {
          $this.append(id, timestamp + 1, 0);
          if (resolve) {
            resolve();
          }
        }, resetValueTimeout);
      }
    });
  };

  TimeSeriesCharts.prototype.destroy = function () {
    _.forEach(timeoutTasks, function (task) {
      clearTimeout(task);
    });
    _.forEach(charts, function (entry) {
      if (entry.chart) {
        entry.chart.stop();
      }
    });
    charts = {};
    timeoutTasks = {};
  };

  exports.TimeSeriesCharts = TimeSeriesCharts;
})(typeof exports === 'undefined' ? this : exports);
