var React = require('react');
var _ = require('underscore');
var classNames = require('classnames');

var ClusterSettingsBoxItem = React.createClass({
  
  render: function(){
    
    return (
      <div>
        {this.props.serviceSettings.breed.name}
      </div>
  )}
});

module.exports = ClusterSettingsBoxItem;