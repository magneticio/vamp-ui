var React = require('react');
var ServiceBox = require('./ServiceBox.jsx');

var ServicesList = React.createClass({

  propTypes: {
    services: React.PropTypes.array,
  },

  render: function() {

    var services = []
  
    for (var key in this.props.services) {
        services.push(<ServiceBox key={key} service={this.props.services[key]} onOptionsUpdate={this.props.onOptionsUpdate}/>);
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