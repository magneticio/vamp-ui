var React = require('react');
var LineChart = require('react-chartjs').Bar;

var MetricsGraph = React.createClass({

  graphdata: [],
  chartOptions: {},

  getInitialState: function() {
    return {
      chartIsRunning: false,
    };
  },

  render: function() {

    var chartData = {
      labels: ['100', '16', '72', '41', '5', '81', '60', '80', '92', '11', '43', '34', '11', '86', '73', '66', '32', '67', '87', '78', '32', '11', '2', 93],//["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Reqs/sec.",
          fillColor: "#03A9F4",
          strokeColor: "#03A9F4",
          // pointColor: "rgba(220,220,220,1)",
          // pointStrokeColor: "#fff",
          // pointHighlightFill: "#fff",
          // pointHighlightStroke: "rgba(220,220,220,1)",
          data: [100, 16, 72, 41, 5, 81, 60, 80, 92, 11, 43, 34, 11, 86, 73, 66, 32, 67, 87, 78, 32, 11, 5, 93]
        }
      ]
    };

    var chartOptions = {
      showScale: false,
      scaleShowGridLines: false,
      responsive: true,
      animation: false,
      maintainAspectRatio: false,
      barValueSpacing : 1,
    }


    return(
      <div className='deployment-metrics-chart metrics-chart'>
          <LineChart data={chartData} options={chartOptions}/>
      </div>
    )}
  }
);
 
module.exports = MetricsGraph;