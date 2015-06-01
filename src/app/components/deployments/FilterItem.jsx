var React = require('react');
var FilterItem = React.createClass({
  
  propTypes: {
    filter: React.PropTypes.object,
  },

  render: function() {

    return(
      <li className="filter-list-item">
        <a>{React.addons.createFragment(this.props.filter)}</a>
     </li>
  )}
});
 
module.exports = FilterItem;