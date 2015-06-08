var React = require('react');
var DeploymentActions = require('../../actions/DeploymentActions');
var cx = require('classnames');

var FilterItem = React.createClass({
  
  propTypes: {
    filter: React.PropTypes.object,
  },

  getInitialState: function(){
  	return {
  		disabled: true,
      value: '',
      updated: false,
      hidden: ''
  	}
  },
  componentDidMount: function(){
    this.setState({
      value: this.props.filter['condition']
    });
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.filter.condition !== this.state.value && this.state.disabled && !this.state.updated){
      this.setState({
        value: nextProps.filter.condition
      });
    }
  },

  handleClick: function(){
  	this.setState({
  		disabled: false
  	});
  },
  handleSubmit: function(e){
  	e.preventDefault();

    this.props.updateFilters(this.state.value, this.props.filter['condition']);

    if(this.state.value == ''){
      this.setState({
        hidden: 'hidden'
      });
    }
    // TODO: set state after succes returns
    this.setState({
      disabled: true,
      updated: true
    });
  },
  handleChange: function(e){
    this.setState({value: e.target.value});
  },

  render: function() {

    var inputClasses = cx('editable', this.state.hidden);

    return(
      <li className="filter-list-item">
      	<form onSubmit={this.handleSubmit}>
        	<input 
            type="text" 
            value={this.state.value} 
            className={inputClasses} 
            disabled={this.state.disabled}
            onClick={this.handleClick} 
            onChange={this.handleChange} />
          <input 
            type='submit' 
            value='save' 
            className='submit-button'
            disabled={this.state.disabled}
            onClick={this.handleSubmit} />
        </form>
     </li>
  )}
});
 
module.exports = FilterItem;