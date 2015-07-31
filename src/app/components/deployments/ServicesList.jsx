var React = require('react');
var ServiceBox = require('./ServiceBox.jsx');

var ServicesList = React.createClass({

  propTypes: {
    services: React.PropTypes.array,
  },

  handleEditWeight: function(){
    console.log('edit!');
  },

  render: function() {

    var services = []
  
    for (var key in this.props.services) {
      services.push(
        <ServiceBox 
          key={key} 
          service={this.props.services[key]} 
          serviceMetrics={this.props.serviceMetrics} 
          cluster={this.props.cluster} 
          updateServiceListFilters={this.props.updateClusterFilters} 
          handleEditWeight={this.handleEditWeight} />);
    }

    return (
      <div className='services'>
        <div>         
          {services}
        </div>
      </div>
  )}
});
 
module.exports = ServicesList;