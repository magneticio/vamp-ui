var React = require('react');
var _ = require('underscore');
var ServiceBox = require('./ServiceBox.jsx');

var ServicesList = React.createClass({

  propTypes: {
    services: React.PropTypes.array,
  },

  render: function() {

    var services = [],
        disableWeightSetting = this.props.services.length == 1 ? true : false;
    
    for (var key in this.props.services) {
      services.push(
        <ServiceBox 
          key={key} 
          service={this.props.services[key]} 
          cluster={this.props.cluster} 
          updateServiceListFilters={this.props.updateClusterFilters} 
          handleEditWeight={this.props.handleEditWeight} 
          disableWeightSetting={disableWeightSetting} />);
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