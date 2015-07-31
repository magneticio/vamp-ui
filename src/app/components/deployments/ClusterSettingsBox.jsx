var React = require('react');
var _ = require('underscore');
var classNames = require('classnames');
var ClusterSettingsBoxItem = require('./ClusterSettingsBoxItem.jsx');

var ClusterSettingsBox = React.createClass({

  createServiceObject: function(service){
    return {
      name: service.breed.name,
      weight: service.routing.weight
    }
  },
  
  render: function(){
    
    var services = this.props.services,
        servicesSettingList = [];

    _.each(services, function(service,key){
      servicesSettingList.push(<ClusterSettingsBoxItem key={key} serviceSettings={service} />);
    }, this);

    // Dynamic classes
    var clusterCrudClasses = classNames('cluster-crud', {
      'active': this.props.editServiceActive && this.props.activeCluster
    });
    var clusterSettingsHeight = this.props.editServiceActive && this.props.activeCluster ? { height: this.props.services.length * 26 } : { height: 0 }

    return (
      <div className={clusterCrudClasses} style={clusterSettingsHeight}>
        {servicesSettingList}
      </div>
  )}
});

module.exports = ClusterSettingsBox;