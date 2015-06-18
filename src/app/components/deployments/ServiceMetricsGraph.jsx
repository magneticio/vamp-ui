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

    return(
      <div className='service-metrics-container'>
        <h4>Resp. time</h4>
        <h3>45 <small className='muted'>ms</small></h3>
        <h4>reqs / sec</h4>
        <h3>45 <small className='muted'>64 max</small></h3>
      </div>
    )}
  }
);
 
module.exports = ServiceMetricsGraph;