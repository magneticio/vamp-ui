var React = require('react');
var LineChart = require('react-chartjs').Line;
var _ = require('underscore');
var cx = require('classnames');

var MetricsGraph = React.createClass({

  getInitialState: function() {
    return {
      datapoints: 30,
      label: '',
      loadingMetrics: true
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

  componentWillReceiveProps: function(nextProps){
    if(nextProps.data && _.size(nextProps.data) > 0)
      this.setState({ loadingMetrics: false });
    else {
      this.setState({ loadingMetrics: true });
    }
  },

  render: function() {

    var linechart = '',
        mostRecentDatapoint = '-',
        filteredApiData = [],
        timestamps = [];

    if(!this.state.loadingMetrics){

      var filteredApiData = [],
          chartLabels = [],
          chartOptions = {},
          chartData = {},
          i = 0;

      _.each(this.props.data, function(property, key){
        if(i % 2 == 0){
          filteredApiData.push(property['value']);
          chartLabels.push('');
        }
        i++;
      }, this);

      mostRecentDatapoint = filteredApiData[0];
      filteredApiData = filteredApiData.reverse();

      chartOptions = {
        showScale: true,
        scaleFontSize: 10,
        scaleShowGridLines: true,
        scaleShowVerticalLines: false,
        showTooltips: false,
        responsive: true,
        animation: false,
        maintainAspectRatio: false,
        bezierCurve : true,
        bezierCurveTension : 0.3,
        pointDot: false,
        datasetStrokeWidth : 1,
        datasetFill : true,
      };

      chartData = {
        labels: chartLabels,
        datasets: [
          {
            label: "Reqs/sec.",
            fillColor: "RGBA(3, 169, 244, 0.4)",
            strokeColor: "RGBA(3, 169, 244, 0)",
            data: filteredApiData,
          }
        ]
      };

      linechart = (<LineChart data={chartData} options={chartOptions}/>);
    }

    if(this.props.data){
      timestamps.push(this.props.data[0].timestamp);
      timestamps.push(this.props.data[14].timestamp);
      timestamps.push(this.props.data[29].timestamp);
    }

    console.log(timestamps);

    loaderClasses = cx({
      'metrics-loader': true,
      'hidden': this.state.loadingMetrics ? false : true
    });

    return(
      <div className='deployment-metrics-chart metrics-chart'>
        <div className='metrics-requests'>
          <h5>{this.state.label}: <strong>{mostRecentDatapoint}</strong></h5>
        </div>
        <div>
          <span className={loaderClasses}><img src="/images/spinner-pink.svg" /></span>
          {linechart}
        </div>
      </div>
    )}
  }
);
 
module.exports = MetricsGraph;