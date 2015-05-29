var React = require('react');
var TimeAgo = require('react-timeago');
var ServersList = require('./ServersList.jsx')
var WeightSetter = require('./WeightSetter.jsx')
var FilterList = require('./FilterList.jsx')
var ServiceBox = React.createClass({

  render: function() {

    var service = this.props.service
    var date = new Date(service.state.started_at)
    var stateClass = (service.state.name === 'Error') ? 'danger' : 'success';
    var notifClass = service.state.notification ? '' : 'hidden';

    return(
      <div className='service-box'>
        <div className={'dialog dialog-'+ stateClass + ' ' + notifClass}>
          {service.state.notification}
        </div>
      	<div className='service-section'>
      	  <p className='small-caps'>{service.breed.deployable}</p>
          <h3><a href={'/#/breeds/' + service.breed.name }> {service.breed.name}</a></h3>
          <p className='small-caps'>started <TimeAgo date={date}/></p>
        </div>
        <div className='service-section service-routing'>
        	<h4>Weight</h4>
          <WeightSetter weight={service.routing.weight}/>
          <h4>Filters</h4>
          <FilterList filters={service.routing.filters}/>
        </div>
        <div className='service-section service-metrics'>
        	<img src="/images/temp-service-graph.svg" />
        </div>
        <div className='service-section service-status'>
        	<h4>Status</h4>
        	<p>{service.state.name}</p>
        </div>
      </div>
    )}
});
 
module.exports = ServiceBox;

