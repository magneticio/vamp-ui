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
      <div className='weight-setter' onMouseOver={this.toggleHovered} onMouseOut={this.toggleHovered}>
        <div className={this.state.hovered ? '' : 'hidden'}>
          <div className='btn-group-vertical plus-minus'>
            <button className="btn btn-info" type="button">-</button>
            <button className="btn btn-info" type="button">+</button>
          </div>
        </div>  
        <h3>{this.props.weight}%</h3>
      </div>
  )}
});
 
module.exports = WeightSetter;