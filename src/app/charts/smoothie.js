/* global SmoothieChart,TimeSeries */
function Chart(id, options) { // eslint-disable-line no-unused-vars
  var canvas = document.getElementById(id);
  var series = new TimeSeries();

  var config = _.merge({
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
    minValue: 0,
    millisPerPixel: 100
  }, options || {});

  var chart = new SmoothieChart(config);

  chart.addTimeSeries(series, {
    lineWidth: 2,
    strokeStyle: '#0080ff',
    fillStyle: 'rgba(0,128,255,0.5)'
  });
  chart.streamTo(canvas, 0);

  var timer = null;

  this.append = function (timestamp, value, reset, after, callback) {
    if (timer !== null) {
      clearTimeout(timer);
    }
    if (reset !== null && after !== null) {
      timer = setTimeout(function () {
        series.append(timestamp + after, reset);
        if (callback) {
          callback();
        }
      }, after);
    }
    series.append(timestamp, value);
  };
}
