var React = require('react');
var FilterItem = React.createClass({
  
  propTypes: {
    filter: React.PropTypes.object,
  },

  getInitialState: function(){
  	return {
  		disabled: true
  	}
  },

  handleClick: function(){
  	this.setState({
  		disabled: false
  	});
  },

  render: function() {

    return(
      <li className="filter-list-item">
        <input type="text" defaultValue={this.props.filter['condition']} className='editable' onClick={this.handleClick} disabled={this.state.disabled} />
     </li>
  )}
});
 
module.exports = FilterItem;