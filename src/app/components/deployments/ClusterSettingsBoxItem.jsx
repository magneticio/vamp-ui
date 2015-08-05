var React = require('react');
var _ = require('underscore');
var classNames = require('classnames');

var ClusterSettingsBoxItem = React.createClass({

  // Component lifecycle
  getInitialState: function(){
    return {
      weight: this.props.weight,
    }
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.weight != this.state.weight){
      this.setState({ weight: nextProps.weight });
    }
  },

  // Event handler
  handleWeightSliderChange: function(e){
    this.props.handleWeightSliderChange(e, this.props.serviceSettings.breed.name);
  },
  
  // Render
  render: function(){
    
    var settings = this.props.serviceSettings;

    return (
      <div>
        <div className="section-fifth">
          {settings.breed.name}
        </div>
        <div className="section-fifth double weight-range">
          <p>{this.state.weight}%</p>
          <input type="range" min="0" max="100" step="1" 
            defaultValue={settings.routing.weight}
            value={this.state.weight}
            onChange={this.handleWeightSliderChange} />
        </div>
        <div className="section-fifth">
          173
        </div>
        <div className="section-fifth">
          548
        </div>
      </div>
  )}
});

module.exports = ClusterSettingsBoxItem;