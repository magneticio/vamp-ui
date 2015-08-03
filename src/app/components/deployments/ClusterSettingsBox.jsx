var React = require('react');
var _ = require('underscore');
var classNames = require('classnames');
var ClusterSettingsBoxItem = require('./ClusterSettingsBoxItem.jsx');

var ClusterSettingsBox = React.createClass({

  getInitialState: function(){
    return {
      weights: {}
    }
  },
  componentDidMount: function(){
    this.setWeights(this.props.services);
  },
  componentWillReceiveProps: function(nextProps){
    if(!this.props.activeCluster)
      this.setWeights(nextProps.services);
  },

  // Event handlers
  handleWeightSliderChange: function(e, name){
    if(e){
      this.updateWeights(name, e.currentTarget.value);
    }
  },

  // Helper methods
  setWeights: function(services){
    var _weightsObject = {};
    _.each(services, function(service,key){
      _weightsObject[service.breed.name] = service.routing.weight;
    }, this);
    this.setState({ weights: _weightsObject });
  },
  updateWeights: function(serviceName, value){
    var self = this,
        _oldWeights = this.state.weights;
    
    _oldWeights[serviceName] = value;
    
    this.calculateWeights(_oldWeights, [serviceName], function(_newWeights){
      self.setState({ weights: _newWeights});
    });  
  },
  calculateWeights: function(weightsObject, lockedServices, callback){
    var newWeights = {},
        percentageToDivide = 100,
        percentagePerService = 0;

    _.each(lockedServices, function(service){
      percentageToDivide -= weightsObject[service];
      newWeights[service] = weightsObject[service];
    });

    percentagePerService = percentageToDivide / ( Object.keys(weightsObject).length - lockedServices.length );

    console.log('percentage to divide', percentageToDivide);
    console.log('percentage per service', percentagePerService);
  
    for (var service in weightsObject) { 
      if(!(service in newWeights))
        newWeights[service] = percentagePerService; 
    }
    callback(newWeights);
  },
  
  // Render
  render: function(){
    
    var services = this.props.services,
        servicesSettingList = [];

    _.each(services, function(service,key){
      _weight = this.state.weights[service.breed.name] ? this.state.weights[service.breed.name] : 0;
      servicesSettingList.push(<ClusterSettingsBoxItem key={key} serviceSettings={service} handleWeightSliderChange={this.handleWeightSliderChange} weight={_weight} />);
    }, this);

    // Dynamic classes
    var clusterOptionsClasses = classNames('cluster-options', {
      'active': this.props.editServiceActive && this.props.activeCluster
    });
    var clusterSettingsHeight = this.props.editServiceActive && this.props.activeCluster ? { height: this.props.services.length * 58 } : { height: 0 }

    return (
      <div className={clusterOptionsClasses} style={clusterSettingsHeight}>
        {servicesSettingList}
      </div>
  )}
});

module.exports = ClusterSettingsBox;