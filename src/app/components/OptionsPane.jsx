var React = require('react/addons');
var Config = require('../config.js');
var classNames = require('classnames');

var OptionsPane = React.createClass({

	contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function(){
  	return {
  		apiUrl: '',
  	}
  },
  componentDidMount: function(){
    this.setState({
      apiUrl: Config.getApiHost(),
    });
  },

  handleSubmit: function(e){
    e.preventDefault();
    Config.setApiHost(this.state.apiUrl);
  },
  handleChange: function(e){
    this.setState({apiUrl: e.target.value});
  },

  render: function(){

  	return (
  		<aside className='options-pane'>
  			<div className='inner-options-pane'>

	  			<form onSubmit={this.handleSubmit}>
	          <input 
	            type='text' 
	            value={this.state.apiUrl}
	            onChange={this.handleChange} />
	          </form>

	        </div>
  		</aside>
  	);
  }

});

module.exports = OptionsPane;