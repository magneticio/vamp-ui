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

  handleSubmit: function(e){
  	e.preventDefault();
  	console.log('submit!');
  },

  render: function() {

    return(
      <li className="filter-list-item">
      	<form onSubmit={this.handleSubmit}>
        	<input type="text" defaultValue={this.props.filter['condition']} className='editable' onClick={this.handleClick} disabled={this.state.disabled} />
        </form>
     </li>
  )}
});
 
module.exports = FilterItem;