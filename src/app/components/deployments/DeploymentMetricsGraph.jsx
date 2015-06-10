var React = require('react');
var LineChart = require('react-chartjs').Bar;
var _ = require('underscore');

var MetricsGraph = React.createClass({

  getInitialState: function() {
    return {
      datapoints: 30,
      label: ''
    };
  },

  componentWillMount: function(){
    if(this.props.metricsType == 'rate'){
      this.setState({
        label: 'requests / sec'
      });
    }
    if(this.props.metricsType == 'scur'){
      this.setState({
        label: 'current sessions'
      });
    }
  },

  render: function() {
    var linechart = '';
    var mostRecentDatapoint = 0;

    if(!_.isEmpty(this.props.data) ){

      var filteredApiData = [];
      var chartLabels = [];

      _.each(this.props.data, function(property, key){
        filteredApiData.push(property['value']);
        chartLabels.push('');
      }, this);

      var mostRecentDatapoint = filteredApiData[0];
      filteredApiData = filteredApiData.reverse();

      var chartOptions = {
        showScale: true,
        scaleFontSize: 10,
        scaleShowGridLines: true,
        responsive: true,
        animation: false,
        barShowStroke : false,
        maintainAspectRatio: false,
        barValueSpacing : 1,
      };

      var chartData = {
        labels: chartLabels,
        datasets: [
          {
            label: "Reqs/sec.",
            fillColor: "#BCDFFA",
            highlightFill: "#03A9F4",
            data: filteredApiData
          }
        ]
      };

      var linechart = <LineChart data={chartData} options={chartOptions}/>  
    } 

    return(
      <div className='deployment-metrics-chart metrics-chart'>
        <div className='metrics-requests'>
          <h5><strong>{this.state.label}</strong></h5>
          <h3>{mostRecentDatapoint} </h3><small className='muted'>64 max</small>
        </div>
        <div>
          {linechart}
        </div>
      </div>
    )}
  }
);
 
module.exports = MetricsGraph;