var _ = require('underscore');
var React = require('react/addons');
var classNames = require('classnames');
var SetIntervalMixin = require("../../mixins/SetIntervalMixin.js");
var ClusterBox = require('./ClusterBox.jsx');
var DeploymentActions = require('../../actions/DeploymentActions');
var LoadStates = require("../../constants/LoadStates.js");
var DeploymentStore = require('../../stores/DeploymentStore');
var TransitionGroup = React.addons.CSSTransitionGroup;
var DeploymentMetricsGraph = require('./DeploymentMetricsGraph.jsx');
var ToolBar = require('../toolbar/ToolBar.jsx');

var DeploymentDetail = React.createClass({
  
  mixins: [SetIntervalMixin],

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return  {
      loadState: LoadStates.STATE_LOADING,
      deployment: {},
      name: this.context.router.getCurrentParams().id,
      deploymentAsBlueprint: null,
    }
  },
  componentDidMount: function() {
    DeploymentActions.getDeployment(this.state.name);
    DeploymentActions.getDeploymentStatus(this.state.name);
    DeploymentStore.addChangeListener(this._onChange);
    var self = this;
    
    this.setState({
      deployment: DeploymentStore.getCurrent()
    });

    DeploymentActions.getDeploymentMetrics(deployment, 'rate');
    DeploymentActions.getDeploymentMetrics(deployment, 'rtime');      

    this.setInterval(function(){
      console.log('poll metrics');
      DeploymentActions.getDeploymentMetrics(deployment, 'rate');
      DeploymentActions.getDeploymentMetrics(deployment, 'rtime');
      DeploymentActions.getDeploymentStatus(self.state.name);
    }, 4000);
  },
  componentWillUnmount: function() {
    DeploymentStore.removeChangeListener(this._onChange);
  },

  handleSubmit: function() {
    this.props.getDeploymentDetails;
  },
  handleExportAsBlueprint: function(type){
    DeploymentActions.getDeploymentAsBlueprint(this.state.deployment, type);
  },
  editDeployment: function(){
    // temp, should be set in Toolbar.jsx preferably
    var type = 'application/x-yaml';
    DeploymentStore.clearCurrentAsBlueprint();
    DeploymentActions.getDeploymentAsBlueprint(this.state.deployment, type);
  },
  
  onOptionsUpdate: function(cluster, service, filters, weight){
    DeploymentActions.putRoutingOption(deployment, cluster, service, filters, weight);
  },

  render: function() {
    
    deployment = this.state.deployment;

    var errorsToBeShown = this.props.errors['UNREACHABLE'] ? true : false,
        errorMessage = errorsToBeShown ? this.props.errors['UNREACHABLE'].message : '',
        pulseError = this.props.errors['PULSE_ERROR'] ? true : false,
        pulseErrorMessage = pulseError ? this.props.errors['PULSE_ERROR'].message : '';

    //grab the endpoint
    var endpoints = [] 
    _.each(deployment.endpoints,function(val,key){
      endpoints.push(<h1 key={key}>{val} / {key} <small className="muted">endpoint</small></h1>);
    });

    // push cluster into an array
    var clusters = [];
    _.chain(deployment.clusters)
      .pairs()
      .each(function(item,idx){
        clusters.push(<ClusterBox key={item[0]} name={item[0]} cluster={item[1]} serviceMetrics={deployment.serviceMetrics} onOptionsUpdate={this.onOptionsUpdate} />);
      }, this).value()

    // Setup dynamic classes
    var containerClassnames = classNames({
      'dimmed': errorsToBeShown
    });
    var errorMessageClassSet = classNames({
      "error-status-message": true,
      "container-status-message": true,
      "hidden": !errorsToBeShown
    });
    var pulseErrorMessageClassSet = classNames('error-status-message', 'pulse-status-message', {
      'hidden': !pulseError
    });

    return(
      <TransitionGroup component="div" transitionName="fadeIn" transitionAppear={true}>
      <span className={errorMessageClassSet}>{errorMessage}</span>
      <ToolBar 
        withBreadcrumbs={true} 
        editDeployment={this.editDeployment}
        deploymentAsBlueprint={this.state.deploymentAsBlueprint} />
      <section id="deployment-single" className={containerClassnames}>
        <div className='section-full'>
          <div id="general-metrics" className='detail-section'>
            <div className='endpoints-container'>
              {endpoints}
            </div>
            <div className={pulseErrorMessageClassSet} >
              {pulseErrorMessage}
            </div>
            <div className="deployment-metrics-container">
              <div className="deployment-status hidden">
                UP
              </div>
              <DeploymentMetricsGraph data={deployment.rate} metricsLabel='requests / sec' />
              <DeploymentMetricsGraph data={deployment.rtime} metricsLabel='ms resp. time' />              
            </div>
          </div>
          <div className='detail-section'>
              {clusters}
          </div>
        </div>
      </section>
      </TransitionGroup>
  )},

  _onChange: function() {
    //console.log('%c change! ', 'background-color: #F2C500; color: white;');
    this.setState({
      deployment: DeploymentStore.getCurrent(),
      deploymentAsBlueprint: DeploymentStore.getCurrentAsBlueprint()
    });
  }
});
 
module.exports = DeploymentDetail;