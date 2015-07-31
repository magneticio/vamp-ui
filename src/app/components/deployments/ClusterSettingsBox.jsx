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
    this.setWeights(nextProps.services);
  },

  // Event handlers
  handleWeightSliderChange: function(e, name){
    if(e){
      console.log(name);
      console.log(e.currentTarget.value);
      //this.setState({ weight: e.currentTarget.value });
    }
  },

  // Helper methods
  setWeights: function(services){
    _weightsObject = {};
    _.each(services, function(service,key){
      _weightsObject[service.breed.name] = service.routing.weight;
    }, this);
    this.setState({ weights: _weightsObject });
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