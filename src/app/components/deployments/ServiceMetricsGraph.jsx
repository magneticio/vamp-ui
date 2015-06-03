var React = require('react');
var LineChart = require('react-chartjs').Line;

var ServiceMetricsGraph = React.createClass({

  graphdata: [],
  chartOptions: {},

  getInitialState: function() {
    return {
      chartIsRunning: false,
    };
  },

  render: function() {

    var chartData = {
      labels: ['1', '1', '1', '1', '1', '1', '1', '1'],//["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Reqs/sec.",
          fillColor: "rgba(220,220,220,0)",
          strokeColor: "#03A9F4",
          // pointColor: "rgba(220,220,220,1)",
          // pointStrokeColor: "#fff",
          // pointHighlightFill: "#fff",
          // pointHighlightStroke: "rgba(220,220,220,1)",
          data: [100, 16, 72, 41, 5, 81, 60, 80]
        }
      ]
    };

    var chartOptions = {
      showScale: false,
      scaleShowGridLines: false,
      responsive: true,
      pointDot: false,
      animation: false,
      maintainAspectRatio: false,
      bezierCurveTension : 0.4,
    }


    return(
      <div id='service-metrics-container'>
        <div className='metrics-chart'>
          <LineChart data={chartData} options={chartOptions}/>
        </div>
        <div className='metrics-chart'>
          <LineChart data={chartData} options={chartOptions}/>
        </div>
      </div>
    )}
  }
);
 
module.exports = ServiceMetricsGraph;