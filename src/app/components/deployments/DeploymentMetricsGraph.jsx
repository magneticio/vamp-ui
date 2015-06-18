var React = require('react');
var LineChart = require('react-chartjs').Bar;
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
    if(_.size(nextProps.data) > 0)
      this.setState({ loadingMetrics: false });
  },

  render: function() {

    var linechart = '',
        mostRecentDatapoint = 0,
        filteredApiData = [],
        loaderClasses = cx({
          'metrics-loader': true,
          'hidden': this.state.loadingMetrics ? false : true
        });


    if(!this.state.loadingMetrics){

      var filteredApiData = [],
          chartLabels = [],
          chartOptions = {},
          chartData = {},
          linechart;

      _.each(this.props.data, function(property, key){
        filteredApiData.push(property['value']);
        chartLabels.push('');
      }, this);

      mostRecentDatapoint = filteredApiData[0];
      filteredApiData = filteredApiData.reverse();

      chartOptions = {
        showScale: true,
        scaleFontSize: 10,
        scaleShowGridLines: true,
        responsive: true,
        animation: false,
        barShowStroke : false,
        maintainAspectRatio: false,
        barValueSpacing : 1,
      };

      chartData = {
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

      linechart = (<LineChart data={chartData} options={chartOptions}/>);
    }

    return(
      <div className='deployment-metrics-chart metrics-chart'>
        <div className='metrics-requests'>
          <h5><strong>{this.state.label}</strong></h5>
          <h3>{mostRecentDatapoint} </h3><small className='muted'>64 max</small>
        </div>
        <div>
          <span className={loaderClasses}>loading</span>
          {linechart}
        </div>
      </div>
    )}
  }
);
 
module.exports = MetricsGraph;