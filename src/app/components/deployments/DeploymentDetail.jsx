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
  
  // Etc
  mixins: [SetIntervalMixin],
  contextTypes: {
    router: React.PropTypes.func
  },

  // Component lifecycle
  getInitialState: function() {
    return  {
      loadState: LoadStates.STATE_LOADING,
      deployment: {},
      name: this.context.router.getCurrentParams().id,
      deploymentAsBlueprint: null,
      editServiceActive: false,
      updatePending: false,
    }
  },
  componentDidMount: function() {
    var self = this;
    mixpanel.track("Deployment detail screen opened");        
    DeploymentActions.getDeployment(this.state.name);
    DeploymentActions.getDeploymentStatus(this.state.name);
    DeploymentStore.addChangeListener(this._onChange);
    this.setState({ deployment: DeploymentStore.getCurrent() });
    DeploymentActions.getEndpointMetrics(deployment);

    this.setInterval(function(){
      DeploymentActions.getEndpointMetrics(deployment);
      DeploymentActions.getDeploymentStatus(self.state.name);
    }, 4000);
    
    DeploymentActions.openEventsStream(this.state.name, ['rate', 'rtime', 'req_rate_max']);
  },
  componentWillUnmount: function() {
    DeploymentActions.closeEventsStream();
    DeploymentStore.removeChangeListener(this._onChange);
    DeploymentActions.getAllDeployments();
  },
  // shouldComponentUpdate: function(nextProps, nextStates){
  //   return JSON.stringify(this.props) != JSON.stringify(nextProps);
  // },

  // Event handlers
  handleSubmit: function() {
    this.props.getDeploymentDetails;
  },
  handleExportAsBlueprint: function(type){
    DeploymentActions.getDeploymentAsBlueprint(this.state.deployment, type);
  },
  editDeployment: function(){
    mixpanel.track("Edit deployment clicked");        
    DeploymentStore.clearCurrentAsBlueprint();
    DeploymentActions.getDeploymentAsBlueprint(this.state.deployment, 'application/x-yaml');
  },
  clearDetailArtefact: function(){
    DeploymentStore.clearCurrentAsBlueprint();
    this.setState({ deploymentAsBlueprint: null });
  },
  handleDeploymentUpdate: function(clustername, weights){
    mixpanel.track("Edit deployment save button clicked");        
    self = this;
    currentDeployment = DeploymentStore.getCurrent();
    formattedWeights = this.formatWeightsDictionary(weights);
    req = {
      name: this.state.name, 
      endpoints: currentDeployment.endpoints,
      clusters: currentDeployment.clusters
    }

    _.each(req.clusters, function(value, key){
      if(key == clustername){
        _.each(value.services, function(service, key){
          service.routing.weight = service.breed.name in weights ? weights[service.breed.name] : service.routing.weight;
        }, this); 
      };
    }, this);

    DeploymentActions.updateDeployment(this.state.name, req, 'application/json');
    this.setState({ updatePending: true });
  },
  handleEditWeight: function(){
    this.state.editServiceActive ? this.setState({ editServiceActive: false }) : this.setState({ editServiceActive: true });
  },

  //Helper functions
  formatWeightsDictionary: function(weights){
    var servicesArray = [];
    _.each(weights, function(routingWeight, breedName){
      var _serviceObject = { 
        breed: {
          name: breedName
        },
        routing: {
          weight: routingWeight
        }
      }
      servicesArray.push(_serviceObject);
    }, this);
    return servicesArray;
  },

  // Render
  render: function() {
    
    deployment = this.state.deployment;

    var errorsToBeShown = this.props.errors['UNREACHABLE'] ? true : false,
        errorMessage = errorsToBeShown ? this.props.errors['UNREACHABLE'].message : '',
        pulseError = this.props.errors['PULSE_ERROR'] ? true : false,
        pulseErrorMessage = pulseError ? this.props.errors['PULSE_ERROR'].message : '';

    //grab the endpoint
    var endpoints = [] 
    _.each(deployment.endpoints,function(val,key){
      endpoints.push(<h1 key={key}>{val} <span className='icon-triangle'></span> {key} <small className="muted">endpoint</small></h1>);
    });

    // push cluster into an array
    var clusters = [];
    _.chain(deployment.clusters)
      .pairs()
      .each(function(item,idx){
        clusters.push(
          <ClusterBox 
            key={item[0]} 
            name={item[0]} 
            cluster={item[1]} 
            handleEditWeight={this.handleEditWeight} 
            editServiceActive={this.state.editServiceActive}
            handleDeploymentUpdate={this.handleDeploymentUpdate} />
        );
      }, this).value()

    // Setup dynamic classes
    var containerClasses = classNames({
      'dimmed': errorsToBeShown
    });
    var errorMessageClasses = classNames({
      "error-status-message": true,
      "container-status-message": true,
      "hidden": !errorsToBeShown
    });
    var pulseErrorMessageClasses = classNames('error-status-message', 'pulse-status-message', {
      'hidden': !pulseError
    });
    var shaderClasses = classNames('shader', {
      'active': this.state.editServiceActive
    });

    var dashboard = ("" + deployment.name).replace(/-/g, '_');
    var iframe = "http://192.168.99.100:5601/app/kibana#/dashboard/" + dashboard + "?embed&_g=(refreshInterval:(display:'5%20seconds',pause:!t,section:1,value:5000),time:(from:now-15m,mode:quick,to:now))";

    return(
      <TransitionGroup component="div" transitionName="fadeIn" transitionAppear={true}>
        <div className={shaderClasses} onClick={this.handleEditWeight}></div>
        <span className={errorMessageClasses}>{errorMessage}</span>
        <ToolBar 
          withBreadcrumbs={true} 
          editDeployment={this.editDeployment}
          deploymentAsBlueprint={this.state.deploymentAsBlueprint} 
          clearDetailArtefact={this.clearDetailArtefact} />
        <section id="deployment-single" className={containerClasses}>
          <div className='section-full'>
            <div id="general-metrics" className='detail-section'>
              <div className='endpoints-container'>
                {endpoints}
              </div>
              <div className={pulseErrorMessageClasses} >
                {pulseErrorMessage}
              </div>
              <div className="deployment-metrics-container">
                <div className="deployment-status hidden">
                  UP
                </div>

              <iframe src={iframe} height="100%" width="100%" frameBorder="0" height="700px"></iframe>
              </div>
            </div>
            <div className='detail-section'>
                {clusters}
            </div>
          </div>
        </section>
      </TransitionGroup>
  )},
  
  // onChange listener actions
  _onChange: function() {
    //this.forceUpdate();
    this.setState({
      deployment: DeploymentStore.getCurrent(),
      deploymentAsBlueprint: DeploymentStore.getCurrentAsBlueprint()
    });
    if(this.state.updatePending){
      this.setState({ 
        editServiceActive: false,
        updatePending: false
      });
    }
  }
});
 
module.exports = DeploymentDetail;