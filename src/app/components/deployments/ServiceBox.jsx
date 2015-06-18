var React = require('react');
var _ = require('underscore')
var TimeAgo = require('react-timeago');
var ServersList = require('./ServersList.jsx');
var WeightSetter = require('./WeightSetter.jsx');
var FilterList = require('./FilterList.jsx');
var StatusIndicator = require('./StatusIndicator.jsx');
var ServiceMetricsGraph = require('./ServiceMetricsGraph.jsx')
var DropdownList = require('../DropdownList.jsx');

var ServiceBox = React.createClass({

  updateServiceFilters: function(filtersArray){
    var currentService = this.props.service.breed.name,
        currentWeight = this.props.service.routing.weight;

    this.props.updateServiceListFilters(currentService, filtersArray, currentWeight);
  },

  generateServersList: function(servers){
    serverlist = [];
    portslist = [];
    
    _.each(servers, function(val,key){
      _.each(val.ports, function(val,key){
        portslist.push(val);
      });
      serverlist.push(
        <li key={key+val}>
          <span className='server-host'>{val.host}</span>
          <span className='server-ports'>: {val.ports}</span>
        </li>
      );
    });

    return serverlist;
  },

  render: function() {

    var service = this.props.service,
        servers = service.servers,
        date = new Date(service.state.started_at),
        stateClass = (service.state.name === 'Error') ? 'danger' : 'success',
        notifClass = service.state.notification ? '' : 'hidden',
        serverlist = this.generateServersList(servers);

    return(
      <div className='service-box'>
        <div className={'dialog dialog-'+ stateClass + ' ' + notifClass}>
          {service.state.notification}
        </div>
      	<div className='service-section service-name section-fifth'>
          <h3><a href={'/#/breeds/' + service.breed.name }> {service.breed.name}</a></h3>
          <p className="muted clip-textoverflow">{service.breed.deployable}</p>
          <h5>updated <TimeAgo date={date}/></h5>
        </div>
        <div className='service-section service-routing section-fifth'>
        	<h4>Weight</h4>
          <WeightSetter weight={service.routing.weight}/>
          <h4>Filters</h4>
          <FilterList filters={service.routing.filters} updateServiceFilters={this.updateServiceFilters} />
        </div>
        <div className='service-section service-metrics section-fifth'>
          <ServiceMetricsGraph />
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

