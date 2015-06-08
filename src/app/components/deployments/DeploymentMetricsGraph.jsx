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
    if(this.props.metricsType == 'rtime'){
      this.setState({
        label: 'req / sec'
      });
    }
    if(this.props.metricsType == 'scur'){
      this.setState({
        label: 'cur. sessions'
      });
    }
  },

  render: function() {

    var linechart = '';
    var mostRecentDatapoint = 0;

    if(!_.isEmpty(this.props.data) ){

      var filteredApiData = [];
      _.each(this.props.data, function(property, key){
        filteredApiData.push(property['value']);
      }, this);

      var chartOptions = {
        showScale: false,
        scaleShowGridLines: false,
        responsive: true,
        animation: false,
        barShowStroke : false,
        maintainAspectRatio: false,
        barValueSpacing : 1,
      };

      var chartData = {
        labels: filteredApiData,
        datasets: [
          {
            label: "Reqs/sec.",
            fillColor: "#BCDFFA",
            highlightFill: "#03A9F4",
            data: filteredApiData
          }
        ]
      };

      var mostRecentDatapoint = filteredApiData[0];
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