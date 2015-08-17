var React = require('react');
var LineChart = require('react-chartjs').Line;
var DeploymentActions = require('../../actions/DeploymentActions');

var ServiceMetricsGraph = React.createClass({
  
  render: function() {

    return(
      <div className='service-metrics-container'>
        <h4>Reqs / sec</h4>
        <h3>{this.props.requestPerSec} <small className='muted normal-weight'>{this.props.req_rate_max} max</small></h3>
        <h4>Resp. time</h4>
        <h3>{this.props.responseTime} <small className='muted normal-weight'>ms</small></h3>
      </div>
    )}
  }
);
 
module.exports = ServiceMetricsGraph;