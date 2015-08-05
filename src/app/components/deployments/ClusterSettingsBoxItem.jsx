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
  componentDidMount: function(){
    var serviceKey = this.props.serviceKey;
        serviceKey = serviceKey.replace(/:/g,'').replace(/\./g,'');

    this.setState({ 
      sliderKey: "rangeSlider-" + serviceKey
    });
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.weight != this.state.weight){
      this.setState({ weight: nextProps.weight });
    }
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.weight !== this.props.weight;
  },
  
  // Event handler
  handleWeightSliderChange: function(e){
    this.props.handleWeightSliderChange(e, this.props.serviceSettings.breed.name);
  },
  
  // Render
  render: function(){
    
    var settings = this.props.serviceSettings;
    var sliderClass = "rangeSlider-" + this.state.sliderKey;

    return (
      <div className="cluster-options-item">      
        <div className="section-fifth">
          {settings.breed.name}
        </div>
        <div className="section-fifth double weight-range">
          <style type="text/css">
            { 
              ".rangeSlider-" + this.state.sliderKey + "::-webkit-slider-runnable-track { background-size: " + this.state.weight + "% 100%!important;} " +
              ".rangeSlider-" + this.state.sliderKey + "::-moz-range-track { background-size: " + this.state.weight + "% 100%!important;} "
            }
          </style>
          <p className="service-weight">{this.state.weight}%</p>
          <input type="range" min="0" max="100" step="1" 
            defaultValue={settings.routing.weight}
            value={this.state.weight}
            className={sliderClass}
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