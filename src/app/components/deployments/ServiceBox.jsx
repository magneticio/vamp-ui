var React = require('react');
var _ = require('underscore')
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

  // Component lifecycle
  getInitialState: function(){
    return {
      loading: true,
      req_rate_max: '0',
      rate: '0',
      rtime: '0'
    }
  },
  componentWillReceiveProps: function(nextProps){

    if(nextProps.service.metrics){
      if(nextProps.service.metrics.rate)
        this.setState({ rate: nextProps.service.metrics.rate });

      if(nextProps.service.metrics.rtime)
        this.setState({ rtime: nextProps.service.metrics.rtime });

      if(nextProps.service.metrics.req_rate_max)
        this.setState({ req_rate_max: nextProps.service.metrics.req_rate_max });
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

    console.log('render');

    var service = this.props.service,
        servers = service.servers,
        date = new Date(service.state.started_at),
        stateClass = (service.state.name === 'Error') ? 'danger' : 'success',
        notifClass = service.state.notification ? '' : 'hidden',
        serverlist = this.generateServersList(servers),
        responseTime = this.state.rtime,
        requestPerSec = this.state.rate,
        req_rate_max = this.state.req_rate_max;

    return(
      <div className='service-box'>
        <div className={'dialog dialog-'+ stateClass + ' ' + notifClass}>
          {service.state.notification}
        </div>
      	<div className='service-section service-name section-fifth'>
          <h3><a href={'/#/breeds/' + service.breed.name } className='editable clip-textoverflow'> {service.breed.name}</a></h3>
          <p className="muted clip-textoverflow">{service.breed.deployable}</p>
          <h5><img src='/images/clock.svg' alt="Clock icon" width='12px' height='12px' className='clock-icon' /> updated <TimeAgo date={date}/></h5>
        </div>
        <div className='service-section service-routing section-fifth'>
          <div className="weightsetBox">
        	 <h4>Weight</h4>
            <WeightSetter weight={service.routing.weight} handleEditWeight={this.props.handleEditWeight}/>
          </div>
          <div className="filterlistBox">
            <h4>Filters</h4>
            <FilterList filters={service.routing.filters} updateServiceFilters={this.updateServiceFilters} />
          </div>
        </div>
        <div className='service-section service-metrics section-fifth'>
          <ServiceMetricsGraph responseTime={responseTime} requestPerSec={requestPerSec} req_rate_max={req_rate_max} />
        </div>
        <div className='service-section service-servers section-fifth'>
          <h4>Servers</h4>
          <ul>
            {serverlist}
          </ul>
        </div>
        <div className='service-section service-status section-fifth'>
        	<h4>Status</h4>
          <StatusIndicator status={service.state.name} />
          <h4>Scale</h4>
          <p>{service.scale.cpu} CPU / {service.scale.memory} MB</p>
          <p className='muted'>{service.scale.instances} instances</p>
        </div>
      </div>
    )}
});
 
module.exports = ServiceBox;

