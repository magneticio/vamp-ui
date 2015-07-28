var React = require('react');
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

  render: function() {

    return(
      <div className='weight-setter'> 
        <h3 className='editable' onClick={this.props.handleWeightEdit}>{this.props.weight}%</h3>
      </div>
  )}
});
 
module.exports = WeightSetter;