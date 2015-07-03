var React = require('react/addons');
var Config = require('../config.js');
var AppActions = require('../actions/AppActions');
var _ = require('underscore');
var classNames = require('classnames');

var OptionsPane = React.createClass({

	contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function(){
  	return {
  		apiUrl: '',
      pulseApiUrl: ''
  	}
  },
  componentDidMount: function(){
    this.setState({
      apiUrl: Config.getApiHost(),
    });
  },
  componentWillReceiveProps: function(){
    this.setState({ pulseApiUrl: Config.getPulseApiUrl() });
  },

  handleSubmit: function(e){
    e.preventDefault();
    Config.setApiHost(this.state.apiUrl);
    AppActions.getInfo();
  },
  handleChange: function(e){
    this.setState({apiUrl: e.target.value});
  },

  render: function(){

    var formattedInfoObject = {},
        apiInfo = {};

    apiInfo = this.props.apiInfo;

    if( !_.isEmpty(apiInfo) ){
      formattedInfoObject = {
        message: apiInfo.message,
        apiStatus: 'ok',
        pulseApiStatus: apiInfo.pulse.message || 'offline',
        containerDriver: apiInfo.container_driver.type || 'not connected'
      }

    } else {
      formattedInfoObject = {
        message: "It seems the api can't be reached, we're sorry",
        apiStatus: 'offline',
        pulseApiState: 'offline',
        containerDriver: 'not connected'
      }
    }

  	return (
  		<aside className='options-pane'>
  			<div className='inner-options-pane'>
	  			<form onSubmit={this.handleSubmit} className='options-form'>

            <h3>{formattedInfoObject.message}</h3>

            <label htmlFor='vamp_uri'>Vamp uri</label>
	          <input 
	            type='text'
              name='vamp_uri' 
	            value={this.state.apiUrl}
	            onChange={this.handleChange} />
             {this.state.pulseApiUrl}

	          </form>
	        </div>
  		</aside>
  	);
  }

});

module.exports = OptionsPane;