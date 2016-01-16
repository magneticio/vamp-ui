var React = require('react');
var _ = require('underscore');
var TimeAgo = require('react-timeago');
var classNames = require('classnames');
var WeightSetter = require('./WeightSetter.jsx');
var FilterList = require('./FilterList.jsx');
var StatusIndicator = require('./StatusIndicator.jsx');
var ServiceMetricsGraph = require('./ServiceMetricsGraph.jsx')
var DropdownList = require('../DropdownList.jsx');
var SetIntervalMixin = require("../../mixins/SetIntervalMixin.js");
var DeploymentActions = require('../../actions/DeploymentActions');

var ServiceBox = React.createClass({
  
  mixins: [SetIntervalMixin],
  contextTypes: {
    router: React.PropTypes.func
  },

  // Component lifecycle
  getInitialState: function(){
    return {
      loading: true,
      rate: '0',
      responseTime: '0',
      deploymentName: this.context.router.getCurrentParams().id,
    }
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.service.metrics){
      if(typeof nextProps.service.metrics.rate != 'undefined')
        this.setState({ rate: nextProps.service.metrics.rate.toFixed(2) });

      if(typeof nextProps.service.metrics.responseTime != 'undefined')
        this.setState({ responseTime: nextProps.service.metrics.responseTime.toFixed(2) });
    }
  },
  shouldComponentUpdate: function(nextProps, nextState){
    if( JSON.stringify(nextProps.service.metrics) == JSON.stringify(this.props.service.metrics) &&
        JSON.stringify(nextProps.service.scale) == JSON.stringify(this.props.service.scale) &&
        JSON.stringify(nextProps.service.state) == JSON.stringify(this.props.service.state) &&
        JSON.stringify(nextProps.service.routing) == JSON.stringify(this.props.service.routing) ){
      return false;
    } else {
      return true;
    }
  },

  // Event handlers
  handleDelete: function(){
    if (confirm('Are you sure you want to delete this service?'))
      DeploymentActions.deleteService(this.state.deploymentName, this.props.service.breed.name);
  },

  // Helpers
  updateServiceFilters: function(filtersArray){
    var currentService = this.props.service.breed.name,
        currentWeight = this.props.service.routing.weight;

    this.props.updateServiceListFilters(currentService, filtersArray, currentWeight);
  },
  generateServersList: function(servers){
    serverlist = [];
    _.each(servers, function(serverval,serverkey){
      _.each(serverval.ports, function(portval,portkey){
        serverlist.push(
          <li key={portkey+portval}>
            <h5 className='server-host'>{serverval.host}</h5>
            <h5 className='server-ports'>:{portval}</h5>
          </li>
        );
      });
    });

    return serverlist;
  },

  // Render
  render: function() {

    var service = this.props.service,
        servers = service.servers,
        date = new Date(service.state.step.since),
        stateClass = (service.state.name === 'Error') ? 'danger' : 'success',
        notifClass = service.state.notification ? '' : 'hidden',
        serverlist = this.generateServersList(servers),
        responseTime = this.state.responseTime,
        requestPerSec = this.state.rate;

    // Dynamic classes
    var deleteButtonClasses = classNames('button', 'clip-textoverflow', {
      'button-ghost disabled': service.routing.weight !== 0,
      'button-red': service.routing.weight == 0,
      'hidden': this.props.disableWeightSetting
    });

    return(
      <div className='service-box'>
        <div className={'dialog dialog-'+ stateClass + ' ' + notifClass}>
          {service.state.notification}
        </div>
      	<div className='service-section service-name section-fifth'>
          <h3><a href={'/#/breeds/' + service.breed.name } className='editable clip-textoverflow'> {service.breed.name}</a></h3>
          <p className="muted clip-textoverflow">{service.breed.deployable}</p>
          <h5><img src='/images/clock.svg' alt="Clock icon" width='12px' height='12px' className='clock-icon' /> updated <TimeAgo date={date}/></h5>
          <button className={deleteButtonClasses} onClick={this.handleDelete}>Delete service</button>
        </div>
        <div className='service-section service-routing section-fifth'>
          <div className="weightsetBox">
        	 <h4>Weight</h4>
            <WeightSetter weight={service.routing.weight} handleEditWeight={this.props.handleEditWeight} disableWeightSetting={this.props.disableWeightSetting}/>
          </div>
          <div className="filterlistBox">
            <h4>Filters</h4>
            <FilterList filters={service.routing.filters} updateServiceFilters={this.updateServiceFilters} />
          </div>
        </div>
        <div className='service-section service-metrics section-fifth'>
          <ServiceMetricsGraph responseTime={responseTime} requestPerSec={requestPerSec} />
        </div>
        <div className='service-section service-servers section-fifth'>
          <h4>Servers</h4>
          <ul>
            {serverlist}
          </ul>
        </div>
        <div className='service-section service-status section-fifth'>
        	<h4>Status</h4>
          <StatusIndicator intention={service.state.intention} step={service.state.step.name} />
          <h4>Scale</h4>
          <p>{service.scale.cpu} CPU / {service.scale.memory}</p>
          <p className='muted'>{service.scale.instances} instances</p>
        </div>
      </div>
    )}
});
 
module.exports = ServiceBox;

