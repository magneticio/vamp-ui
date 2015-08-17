var React = require('react');
var classNames = require('classnames');

var WeightSetter = React.createClass({

  propTypes: {
    weight: React.PropTypes.number,
  },
  
  getInitialState: function() {
    return {
      weight: 0,
      hovered: false
    }
  },

  toggleHovered: function(){
    this.setState({hovered: !this.state.hovered})
  }, 
  handleEditWeight: function(){
    if(!this.props.disableWeightSetting)
      this.props.handleEditWeight();
  },

  render: function() {
    
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