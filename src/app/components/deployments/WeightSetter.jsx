var React = require('react');
var classNames = require('classnames');

var WeightSetter = React.createClass({

  // Etc
  propTypes: {
    weight: React.PropTypes.number,
  },
  
  // Component lifecycle
  getInitialState: function() {
    return {
      weight: 0,
      hovered: false
    }
  },
  shouldComponentUpdate: function(nextProps){
    return this.props.weight != nextProps.weight;
  },

  // Helpers
  toggleHovered: function(){
    this.setState({hovered: !this.state.hovered})
  }, 
  handleEditWeight: function(){
    if(!this.props.disableWeightSetting)
      this.props.handleEditWeight();
  },

  // Render
  render: function() {
    console.log('weightbox render');
    var weightSetterClasses = classNames({
      editable: !this.props.disableWeightSetting
    });

    return(
      <div className='weight-setter'> 
        <h3 className={weightSetterClasses} onClick={this.handleEditWeight}>{this.props.weight}%</h3>
      </div>
  )}
});
 
module.exports = WeightSetter;