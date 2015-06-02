var React = require('react');

var StatusIndicator = React.createClass({

  render: function() {

    return(
      <div className='status-indicator'>
        <ul>
          <li><span className='indicator-circle indicator-top indicator-success' />{this.props.status}</li>
          <li><span className='indicator-circle indicator-bottom indicator-success' />up</li>
        </ul>
      </div>
    )}
});
 
module.exports = StatusIndicator;

