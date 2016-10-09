/* global SmoothieChart,TimeSeries */
function Chart(id) { // eslint-disable-line no-unused-vars
  this.canvas = document.getElementById(id);
  this.series = new TimeSeries();
  this.chart = new SmoothieChart({
    maxValueScale: 1,
    interpolation: 'step',
    grid: {
      fillStyle: '#e6e6e6',
      strokeStyle: '#b3b3b3',
      millisPerLine: 10000,
      verticalSections: 5
    }, labels: {
      fillStyle: '#191919',
      fontSize: 10,
      precision: 0
    },
    timestampFormatter: SmoothieChart.timeFormatter,
    minValue: 0,
    millisPerPixel: 100
  });
  this.chart.addTimeSeries(this.series, {
    lineWidth: 2,
    strokeStyle: '#0080ff',
    fillStyle: 'rgba(0,128,255,0.5)'
  });
  this.chart.streamTo(this.canvas, 0);
}
