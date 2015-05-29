var React = require('react');
var FilterItem = React.createClass({
  
  propTypes: {
    filter: React.PropTypes.object,
  },

  render: function() {

    return(
      <li>
        <a>{this.props.filter}</a>        
     </li>
  )}
});
 
module.exports = FilterItem;