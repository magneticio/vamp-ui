var React = require('react');
var _ = require('underscore');
var classNames = require('classnames');
var ClusterSettingsBoxItem = require('./ClusterSettingsBoxItem.jsx');

var ClusterSettingsBox = React.createClass({

  // Component lifecycle
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
        _totalWeight = 0,
        singlePair = this.props.services.length == 2
    
    newWeights[serviceName] = parseInt(value);

    for (service in newWeights){
      _totalWeight += newWeights[service];
      if(singlePair && service != serviceName)
        newWeights[service] = 100 - value;
    }

    if(singlePair)
      _totalWeight = 100;

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
    var progressTrackClasses = classNames('progress-track', {
      'accepted': this.state.totalWeight == 100
    });
    var totalWeightClasses = classNames({
      
      //'warning-subtle': this.state.totalWeight != 100 
    })
    var clusterSettingsHeight = this.props.editServiceActive && this.props.activeCluster ? { height: (this.props.services.length + 1) * 60 } : { height: 0 }
    var progressTrackWidth =  { width: this.state.totalWeight + "%" }

    return (
      <div className={clusterOptionsClasses} style={clusterSettingsHeight}>
        {servicesSettingList}
        <div className="cluster-options-footer">
          <div className="section-fifth"><strong>Combined</strong></div>
          <div className="section-fifth double">
            <p className={totalWeightClasses}>{this.state.totalWeight}% </p>
            <div className="progress-bar">
              <div className={progressTrackClasses} style={progressTrackWidth}></div>
            </div>
          </div>
          <div className="section-fifth double cluster-option-actions">
            <button className="button button-ghost" onClick={this.props.handleEditWeight}>Cancel</button>
            <button className={saveButtonClasses} onClick={this.props.updateDeployment.bind(null, this.state.weights)}>Save</button>
          </div>
        </div>
      </div>
  )}
});

module.exports = ClusterSettingsBox;