var React = require('react');
var LineChart = require('react-chartjs').Line;
var DeploymentActions = require('../../actions/DeploymentActions');

var ServiceMetricsGraph = React.createClass({

  timer: {},

  getInitialState: function(){
    return {
      requestPerSec: '-',
      req_rate_max: '-',
      responseTime: '-',
    }
  },
  componentWillReceiveProps: function(nextProps){
    this.stopTimer();
    this.setState({
      requestPerSec: nextProps.requestPerSec,
      req_rate_max: nextProps.req_rate_max,
      responseTime: nextProps.responseTime,     
    });
    this.setTimer();
  },

  // Helper methods
  setTimer: function() {
    var self = this;
    this.timer = setTimeout(function(){
      self.setState({
        requestPerSec: '-',
        req_rate_max: '-',
        responseTime: '-',     
      });
    }, 5000);
  },
  stopTimer: function(){
    clearTimeout(this.timer);
  },

  render: function() {

    return(
      <div className='service-metrics-container'>
        <h4>Reqs / sec</h4>
        <h3>{this.state.requestPerSec} <small className='muted normal-weight'>{this.state.req_rate_max} max</small></h3>
        <h4>Resp. time</h4>
        <h3>{this.state.responseTime} <small className='muted normal-weight'>ms</small></h3>
      </div>
    )}
  }
);
 
module.exports = ServiceMetricsGraph;