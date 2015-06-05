var React = require('react');
var TimeAgo = require('react-timeago');
var ServersList = require('./ServersList.jsx');
var WeightSetter = require('./WeightSetter.jsx');
var FilterList = require('./FilterList.jsx');
var StatusIndicator = require('./StatusIndicator.jsx');
var ServiceMetricsGraph = require('./ServiceMetricsGraph.jsx')

var ServiceBox = React.createClass({

  render: function() {
    window.smoothie = false;
    var service = this.props.service
    var date = new Date(service.state.started_at)
    var stateClass = (service.state.name === 'Error') ? 'danger' : 'success';
    var notifClass = service.state.notification ? '' : 'hidden';

    return(
      <div className='service-box'>
        <div className={'dialog dialog-'+ stateClass + ' ' + notifClass}>
          {service.state.notification}
        </div>
      	<div className='service-section service-name'>
          <h3><a href={'/#/breeds/' + service.breed.name }> {service.breed.name}</a></h3>
          <p className="muted">{service.breed.deployable}</p>
          <h5>started <TimeAgo date={date}/></h5>
        </div>
        <div className='service-section service-routing'>
        	<h4>Weight</h4>
          <WeightSetter weight={service.routing.weight}/>
          <h4>Filters</h4>
          <FilterList filters={service.routing.filters}/>
        </div>
        <div className='service-section service-metrics'>
          <ServiceMetricsGraph />
        </div>
        <div className='service-section service-status'>
        	<h4>Status</h4>
          <StatusIndicator status={service.state.name} />
          <h4>Scale</h4>
          <p>{service.scale.cpu} CPU / {service.scale.memory} MB</p>
          <p className='muted'>{service.scale.instances} ({service.scale.instances}) instances</p>
        </div>
      </div>
    )}
});
 
module.exports = ServiceBox;

