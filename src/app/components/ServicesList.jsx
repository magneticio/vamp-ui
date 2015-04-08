var React = require('react');
var ServiceBox = require('./ServiceBox.jsx');

var ServicesList = React.createClass({

  propTypes: {
    services: React.PropTypes.array,
  },

  render: function() {

    var services = []
  
    for (var key in this.props.services) {
        services.push(<ServiceBox key={key} service={this.props.services[key]}/>);
    }

    return (
      <div className='container-fluid services'>
        <div className='row service-header'>
          <div className='col-sm-2'>
              service
          </div>
          <div className='col-sm-2'>
              weight
          </div>
          <div className='col-sm-4'>
              filters
          </div>
          <div className='col-sm-4'>
              servers
          </div>
        </div>
        <hr/>                                
        <div>         
          {services}
        </div>
      </div>
  )}
});
 
module.exports = ServicesList;