var React = require('react');
var LineChart = require('react-chartjs').Line;
var DeploymentActions = require('../../actions/DeploymentActions');

var ServiceMetricsGraph = React.createClass({
  
  componentWillReceiveProps: function(nextProps){
    // console.log('nextprops', nextProps.smax);
    // if(this.props.smax !== nextProps.smax){
    //   this.setState({
    //     smax: nextProps.smax
    //   });
    // }
  },

  render: function() {

    return(
      <div className='service-metrics-container'>
        <h4>Resp. time</h4>
        <h3>{this.props.responseTime} <small className='muted'>ms</small></h3>
        <h4>tcp sess / sec</h4>
        <h3>{this.props.requestPerSec} <small className='muted'>{this.props.smax} max</small></h3>
      </div>
    )}
  }
);
 
module.exports = ServiceMetricsGraph;