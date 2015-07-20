var React = require('react');
var _ = require('underscore')
var TimeAgo = require('react-timeago');
var WeightSetter = require('./WeightSetter.jsx');
var FilterList = require('./FilterList.jsx');
var StatusIndicator = require('./StatusIndicator.jsx');
var ServiceMetricsGraph = require('./ServiceMetricsGraph.jsx')
var DropdownList = require('../DropdownList.jsx');
var SetIntervalMixin = require("../../mixins/SetIntervalMixin.js");
var DeploymentActions = require('../../actions/DeploymentActions');

var ServiceBox = React.createClass({
  
  mixins: [SetIntervalMixin],

  getInitalState: function(){
    return {
      loading: true,
      smax: '-',
      rate: '-',
      rtime: '-'
    }
  },
  componentWillMount: function(){
    var currentService = this.props.service.breed.name,
        cluster = this.props.cluster,
        interval = Math.floor(Math.random() * 2000) + 2000;

    this.setInterval(function(){
      DeploymentActions.getDeploymentMetrics(deployment, null, currentService, cluster);
    }, interval);
  },
  componentWillReceiveProps: function(nextProps){
    //console.log(nextProps);
  },

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
  generateMetric: function(metricType){
    if(!this.props.serviceMetrics)
      return '-';

    if(!this.props.serviceMetrics['services:'+this.props.service.breed.name])
      return '-';
    
    var allMetrics = this.props.serviceMetrics['services:' + this.props.service.breed.name],
        metricValue = null;

    _.each(allMetrics, function(metricObject, key){
      _.each(metricObject['tags'], function(tagValue, key){
        if(tagValue == 'metrics:' + metricType){
          metricValue = metricObject.value;
        }
      }, this);
    }, this);
   
    return metricValue;
  },

  render: function() {

    var service = this.props.service,
        servers = service.servers,
        date = new Date(service.state.started_at),
        stateClass = (service.state.name === 'Error') ? 'danger' : 'success',
        notifClass = service.state.notification ? '' : 'hidden',
        serverlist = this.generateServersList(servers),
        responseTime = this.generateMetric('rtime') || '-',
        requestPerSec = this.generateMetric('rate') || '-',
        smax = this.generateMetric('rate_max');

    return(
      <div className='service-box'>
        <div className={'dialog dialog-'+ stateClass + ' ' + notifClass}>
          {service.state.notification}
        </div>
      	<div className='service-section service-name section-fifth'>
          <h3><a href={'/#/breeds/' + service.breed.name }> {service.breed.name}</a></h3>
          <p className="muted clip-textoverflow">{service.breed.deployable}</p>
          <h5><img src='/images/clock.svg' alt="Clock icon" width='12px' height='12px' className='clock-icon' /> updated <TimeAgo date={date}/></h5>
        </div>
        <div className='service-section service-routing section-fifth'>
        	<h4>Weight</h4>
          <WeightSetter weight={service.routing.weight}/>
          <h4>Filters</h4>
          <FilterList filters={service.routing.filters} updateServiceFilters={this.updateServiceFilters} />
        </div>
        <div className='service-section service-metrics section-fifth'>
          <ServiceMetricsGraph responseTime={responseTime} requestPerSec={requestPerSec} smax={smax} />
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

