var React = require('react');
var Badge = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  render: function() {

    return (
      <div className='badge'>
        <span className='badge-label'>{this.props.label}</span>
        {this.props.valueName}
      </div>
    )}
});
 
module.exports = Badge;