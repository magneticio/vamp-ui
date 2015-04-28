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
            <div className={'row ' + notifClass}>
                <div className='col-sm-12'>
                    <div className={'dialog dialog-'+ stateClass}>
                        {service.state.notification}
                    </div>                
                </div>
            </div>
            <div className='row'>
                <div className='col-sm-4'>
                    <h5><a href={'/#/breeds/' + service.breed.name }> {service.breed.name}</a></h5>
                    <div className='text-muted'>{service.breed.deployable}</div>
                    <div className='text-muted small'>started <TimeAgo date={date}/></div>
                </div>
                <div className='col-sm-4'>
                    <WeightSetter weight={service.routing.weight}/>                                        
                </div> 
                <div className='col-sm-4'>
                    <FilterList filters={service.routing.filters}/>
                </div>
                <div>
                </div>                   
            </div> 
        </div>
    )}
});
 
module.exports = ServiceBox;

