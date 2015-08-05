var React = require('react');
var _ = require('underscore');
var classNames = require('classnames');
var ClusterSettingsBoxItem = require('./ClusterSettingsBoxItem.jsx');

var ClusterSettingsBox = React.createClass({

  getInitialState: function(){
    return {
      weights: {},
      totalWeight: 100,
      dirty: false
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
    if(e && !this.state.dirty)
      this.updateRangeSliders(name, e.currentTarget.value);
  },

  // Helper methods
  setWeights: function(services){
    var _weightsObject = {};
    _.each(services, function(service,key){
      _weightsObject[service.breed.name] = service.routing.weight;
    }, this);
    this.setState({ weights: _weightsObject });
  },
  updateRangeSliders: function(serviceName, value){
    this.setState({ dirty: true });

    var newWeights = this.state.weights,
        _totalWeight = 0;
    
    newWeights[serviceName] = parseInt(value);

    for (service in newWeights){
      _totalWeight += newWeights[service];
    }

    this.setState({ 
      weights: newWeights,
      dirty: false,
      totalWeight: _totalWeight
    });
  },
  
  // Render
  render: function(){
    
    var services = this.props.services,
        servicesSettingList = [];

    _.each(services, function(service,key){
      _weight = this.state.weights[service.breed.name] ? this.state.weights[service.breed.name] : 0;
      servicesSettingList.push(<ClusterSettingsBoxItem key={key} serviceSettings={service} handleWeightSliderChange={this.handleWeightSliderChange} weight={_weight} serviceKey={service.breed.name} />);
    }, this);

    // Dynamic classes
    var clusterOptionsClasses = classNames('cluster-options', {
      'active': this.props.editServiceActive && this.props.activeCluster
    });
    var saveButtonClasses = classNames('button button-pink', {
      'dimmed': this.state.totalWeight != 100 
    });
    var clusterSettingsHeight = this.props.editServiceActive && this.props.activeCluster ? { height: (this.props.services.length + 1) * 60 } : { height: 0 }

    return (
      <div className={clusterOptionsClasses} style={clusterSettingsHeight}>
        {servicesSettingList}
        <div className="cluster-options-footer">
          <div className="section-fifth"></div>
          <div className="section-fifth double">
            {this.state.totalWeight}%
          </div>
          <div className="section-fifth double">
            <button className="button button-ghost">Cancel</button>
            <button className={saveButtonClasses}>Save</button>
          </div>
        </div>
      </div>
  )}
});

module.exports = ClusterSettingsBox;