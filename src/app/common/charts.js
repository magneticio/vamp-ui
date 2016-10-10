/* global SmoothieChart, TimeSeries */
function TimeSeriesCharts() {
  this.charts = {};
  this.timeoutTasks = {};
}

TimeSeriesCharts.defaultChartOptions = {
  maxValueScale: 1,
  interpolation: 'step',
  grid: {
    fillStyle: '#e6e6e6',
    strokeStyle: '#b3b3b3',
    millisPerLine: 10000,
    verticalSections: 5
  },
  labels: {
    fillStyle: '#191919',
    fontSize: 10,
    precision: 0
  },
  timestampFormatter: SmoothieChart.timeFormatter,
  minValue: 0
};

TimeSeriesCharts.defaultTimeSeriesOptions = {
  lineWidth: 2,
  strokeStyle: '#0080ff',
  fillStyle: 'rgba(0,128,255,0.5)'
};

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
      var entry = $this.charts[definition.canvasId] = {};
      entry.series = new TimeSeries();
      entry.chart = new SmoothieChart(_.merge(TimeSeriesCharts.defaultChartOptions, definition.chartOptions || {}));
      entry.chart.addTimeSeries(entry.series, _.merge(TimeSeriesCharts.defaultTimeSeriesOptions, definition.timeSeriesOptions || {}));
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
