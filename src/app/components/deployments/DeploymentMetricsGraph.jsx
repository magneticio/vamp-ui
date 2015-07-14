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

  formatdata: function(dataset, receivingArray, labelArray){
    _.each(dataset, function(property, key){
      receivingArray.push(property['value']);
      labelArray.push('');
    }, this);
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
          chartData = {};

      this.formatdata(this.props.data, filteredApiData, chartLabels);

      mostRecentDatapoint = filteredApiData[0];
      filteredApiData = filteredApiData.reverse();

      chartOptions = {
        showScale: true,
        scaleFontSize: 10,
        scaleFontColor: "rgba(158,158,158,0.5)",
        scaleShowGridLines: true,
        scaleGridLineColor : "RGBA(3, 169, 244, 0.1)",
        scaleShowVerticalLines: false,
        scaleLineColor: "#9E9E9E",
        showTooltips: true,
        responsive: true,
        animation: false,
        maintainAspectRatio: false,
        bezierCurve : true,
        bezierCurveTension : 0.25,
        pointDot: false,
        pointDotRadius : 1,
        datasetStrokeWidth : 2,
        datasetFill : true,
      };

      chartData = {
        labels: chartLabels,
        datasets: [
          {
            label: "Reqs/sec.",
            fillColor: "RGBA(3, 169, 244, 0.2)",
            strokeColor: "#03A9F4",
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