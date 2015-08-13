var React = require('react');
var classNames = require('classnames');
var LineChart = require('react-chartjs').Line;
var _ = require('underscore');
var TransitionGroup = React.addons.CSSTransitionGroup;

var MetricsGraph = React.createClass({

  getInitialState: function() {
    return {
      datapoints: 30,
      loadingMetrics: true
    };
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.data && _.size(nextProps.data) > 0)
      this.setState({ loadingMetrics: false });
    else {
      this.setState({ loadingMetrics: true });
    }
  },

  formatdata: function(dataset, dataArray, labelArray, timestampsArray){

    /* CHARTJS FIX:
     *
     * ChartJS always needs the same amount of data in a set
     * This is a weird bug, but the only workaround (without editing the core)
     * is forcing the array to always be 30 items long. This is the default
     * length of an object returned by pulse, but might change in the future.
     */
    
    for(i = 0; i < 30; i++){
      dataset[i] ? dataArray.push(dataset[i]['value']) : dataArray.push('0');
      labelArray.push('');

      if(timestampsArray && dataset[i])
          timestampsArray.push(dataset[i].timestamp.substr(11, 8));
    }
  },

  render: function() {

    var linechart = '',
        mostRecentDatapoint = '-',
        rawData = {},
        filteredApiData = [],
        timestamps = [];

    if(!this.state.loadingMetrics){

      var filteredApiData = [],
          chartLabels = [],
          chartOptions = {},
          chartData = {};

      rawData = this.props.data[this.props.metricsType];

      this.formatdata(rawData, filteredApiData, chartLabels, timestamps);
      mostRecentDatapoint = filteredApiData[0];

      chartOptions = {
        showScale: true,
        scaleFontSize: 10,
        scaleBeginAtZero: true,
        scaleFontColor: "rgba(158,158,158,0.5)",
        scaleShowGridLines: true,
        scaleGridLineColor : "RGBA(3, 169, 244, 0.1)",
        scaleShowVerticalLines: false,
        scaleLineColor: "#9E9E9E",
        showTooltips: false,
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
            data: filteredApiData.reverse(),
          }
        ]
      };

      linechart = (<LineChart data={chartData} options={chartOptions}/>);
    }

    var loaderClasses = classNames({
      'metrics-loader': true,
      'hidden': this.state.loadingMetrics ? false : true
    });
    var containerClasses = classNames({
      'chart-container': true,
      'invisible': this.state.loadingMetrics ? true : false
    });
   

    return(
      <div className='deployment-metrics-chart metrics-chart'>
        <div className='metrics-title'>
          <h5><strong>{mostRecentDatapoint}</strong> {this.props.metricsLabel}</h5>
        </div>
        <span className={loaderClasses}><img src="/images/spinner-pink.svg" /></span>
        <div className={containerClasses}>
          {linechart}
        </div>
        <ul className='metrics-timestamps'>
          <li>{timestamps[29]}</li>
          <li>{timestamps[14]}</li>
          <li>{timestamps[0]}</li>
        </ul>
      </div>
    )}
  }
);
 
module.exports = MetricsGraph;