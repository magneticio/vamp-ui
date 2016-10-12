/* global SmoothieChart, TimeSeries */
function TimeSeriesCharts() {
  this.charts = {};
  this.timeoutTasks = {};
}

TimeSeriesCharts.chart = 'chart';
TimeSeriesCharts.healthChart = 'health-chart';
TimeSeriesCharts.sparkline = 'sparkline';
TimeSeriesCharts.healthSparkline = 'shealth-parkline';

TimeSeriesCharts.chartOptions = {
  maxValueScale: 1,
  interpolation: 'step',
  sharpLines: true,
  borderVisible: false,
  grid: {
    fillStyle: 'transparent',
    strokeStyle: '#37647D',
    millisPerLine: 10000,
    verticalSections: 5
  },
  labels: {
    fillStyle: '#b9c8d2',
    fontSize: 10,
    precision: 0
  },
  timestampFormatter: SmoothieChart.timeFormatter,
  minValue: 0,
  millisPerPixel: 100
};

TimeSeriesCharts.healthChartOptions = {
  maxValueScale: 1,
  interpolation: 'step',
  sharpLines: true,
  borderVisible: false,
  grid: {
    fillStyle: 'transparent',
    strokeStyle: '#37647D',
    millisPerLine: 10000,
    verticalSections: 5
  },
  labels: {
    fillStyle: '#b9c8d2',
    fontSize: 10,
    precision: 0
  },
  timestampFormatter: SmoothieChart.timeFormatter,
  minValue: 0,
  millisPerPixel: 100
};

TimeSeriesCharts.sparklineOptions = {
  maxValueScale: 1,
  interpolation: 'step',
  sharpLines: true,
  borderVisible: false,
  grid: {
    fillStyle: 'transparent',
    strokeStyle: '#b3b3b3',
    millisPerLine: 10000,
    verticalSections: 5
  },
  minValue: 0,
  millisPerPixel: 300,
  labels: {
    disabled: true
  },
  timestampFormatter: function () {
    return '';
  }
};

TimeSeriesCharts.healthSparklineOptions = TimeSeriesCharts.sparklineOptions;

TimeSeriesCharts.chartTimeSeriesOptions = {
  lineWidth: 2,
  strokeStyle: '#0080ff',
  fillStyle: 'rgba(0,128,255,0.2)'
};

TimeSeriesCharts.healthChartTimeSeriesOptions = {
  lineWidth: 2,
  strokeStyle: '#00ff00',
  fillStyle: 'rgba(0,255,0,0.2)'
};

TimeSeriesCharts.sparklineTimeSeriesOptions = TimeSeriesCharts.chartTimeSeriesOptions;

TimeSeriesCharts.healthSparklineTimeSeriesOptions = TimeSeriesCharts.healthChartTimeSeriesOptions;

TimeSeriesCharts.prototype.define = function (definitions) {
  var $this = this;

  var remove = _.difference(_.map($this.charts, function (v, n) {
    return n;
  }), _.map(definitions, function (definition) {
    return definition.canvasId;
  }));

  _.forEach(remove, function (canvasId) {
    if ($this.charts[canvasId]) {
      if ($this.timeoutTasks[canvasId]) {
        clearTimeout($this.timeoutTasks[canvasId]);
      }
      if ($this.charts[canvasId].chart) {
        $this.charts[canvasId].chart.stop();
      }
      delete $this.charts[canvasId];
    }
  });

  var added = [];

  _.forEach(definitions, function (definition) {
    if (!$this.charts[definition.canvasId]) {
      var chartOptions;
      var timeSeriesOptions;
      if (TimeSeriesCharts.healthChart === definition.type) {
        chartOptions = TimeSeriesCharts.healthChartOptions;
        timeSeriesOptions = TimeSeriesCharts.healthChartTimeSeriesOptions;
      } else if (TimeSeriesCharts.sparkline === definition.type) {
        chartOptions = TimeSeriesCharts.sparklineOptions;
        timeSeriesOptions = TimeSeriesCharts.sparklineTimeSeriesOptions;
      } else if (TimeSeriesCharts.healthSparkline === definition.type) {
        chartOptions = TimeSeriesCharts.healthSparklineOptions;
        timeSeriesOptions = TimeSeriesCharts.healthSparklineTimeSeriesOptions;
      } else {
        chartOptions = TimeSeriesCharts.chartOptions;
        timeSeriesOptions = TimeSeriesCharts.chartTimeSeriesOptions;
      }

      var entry = $this.charts[definition.canvasId] = {};
      entry.series = new TimeSeries();
      entry.chart = new SmoothieChart(chartOptions);
      entry.chart.addTimeSeries(entry.series, timeSeriesOptions);
      entry.chart.streamTo(document.getElementById(definition.canvasId), 0);
      added.push(definition.canvasId);
    }
  });

  return {removed: remove, added: added};
};

TimeSeriesCharts.prototype.append = function (id, timestamp, value) {
  if (this.charts[id] && this.charts[id].series) {
    this.charts[id].series.append(timestamp, value);
  }
};

TimeSeriesCharts.prototype.timeout = function (id, timestamp, value, after) {
  var $this = this;
  if ($this.timeoutTasks[id] !== null) {
    clearTimeout($this.timeoutTasks[id]);
  }
  return new Promise(function (resolve, reject) {
    if (value !== null && after !== null) {
      $this.timeoutTasks[id] = setTimeout(function () {
        $this.append(id, timestamp + after, value);
        resolve();
      }, after);
    } else {
      reject();
    }
  });
};

TimeSeriesCharts.prototype.destroy = function () {
  _.forEach(this.timeoutTasks, function (task) {
    clearTimeout(task);
  });
  _.forEach(this.charts, function (entry) {
    if (entry.chart) {
      entry.chart.stop();
    }
  });
  this.charts = {};
  this.timeoutTasks = {};
};
