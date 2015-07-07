var React = require('react/addons');
var Config = require('../config.js');
var AppActions = require('../actions/AppActions');
var OptionsPaneSection = require('./OptionsPaneSection.jsx');
var AppStore = require('../stores/AppStore');
var _ = require('underscore');
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
    AppActions.getInfo();
  },
  handleChange: function(e){
    this.setState({apiUrl: e.target.value});
  },

  render: function(){

    var formattedInfoObject = {},
        apiInfo = this.props.apiInfo || {},
        welcomeMessage = '',
        jvmItems = {},
        persistenceItems = {},
        routerItems = {},
        pulseItems = {},
        containerDriverItems = {};

    // filter trough info endpoint, set vars
    if( _.isEmpty(apiInfo) || !_.isEmpty(this.props.errors) ){
      welcomeMessage = "It seems the api can't be reached, we're sorry";
    } else {
      welcomeMessage = apiInfo.message;
    }

    try {
      jvmItems['starttime'] = apiInfo.jvm.runtime.start_time;
      jvmItems['uptime'] = apiInfo.jvm.runtime.up_time;
    } catch(e) {
      jvmItems = {};
      jvmItems['error'] = 'Internal error';
      AppStore.putError('INTERNAL', 'Something went wrong while checking the status of services')
    }
    try {
      persistenceItems['type'] = apiInfo.persistence.type;
      persistenceItems['url'] = apiInfo.persistence.url;
      persistenceItems['database'] = apiInfo.persistence.database;
    } catch(e) {
      persistenceItems = {};
      persistenceItems['error'] = 'Internal error';
      AppStore.putError('INTERNAL', 'Something went wrong while checking the status of services')
    }
    try {
      routerItems['memmax__mb'] = apiInfo.router.status.memmax__mb;
      routerItems['name'] = apiInfo.router.status.name;
      routerItems['version'] = apiInfo.router.status.version;
      routerItems['sess_rate'] = apiInfo.router.status.sess_rate;
      routerItems['idle_pct'] = apiInfo.router.status.idle_pct;
      routerItems['uptime'] = apiInfo.router.status.uptime;
    } catch(e) {
      routerItems = {};
      routerItems['error'] = 'Internal error';
      AppStore.putError('INTERNAL', 'Something went wrong while checking the status of services')
    }
    try{
      pulseItems['cluster_name'] = apiInfo.pulse.elasticsearch.cluster_name;
      pulseItems['name'] = apiInfo.pulse.elasticsearch.name;
      pulseItems['version'] = apiInfo.pulse.elasticsearch.version.number;
      pulseItems['lucene_version'] = apiInfo.pulse.elasticsearch.version.lucene_version;
      pulseItems['status'] = apiInfo.pulse.elasticsearch.status;
    } catch(e) {
      pulseItems = {};
      pulseItems['error'] = 'Internal error';
      AppStore.putError('INTERNAL', 'Something went wrong while checking the status of services')
    }
    try {
      containerDriverItems['type'] = apiInfo.container_driver.type;
    } catch(e) {
      containerDriverItems = {};
      containerDriverItems['error'] = 'Internal error';
      AppStore.putError('INTERNAL', 'Something went wrong while checking the status of services')
    }
    
    console.log(this.props.errors);
  	return (
  		<aside className='options-pane'>
  			<div className='inner-options-pane'>
	  			<form onSubmit={this.handleSubmit} className='options-form'>

            <h3>{welcomeMessage}</h3>

            <h4>REST API URL</h4>
	          <input 
	            type='text'
              name='vamp_uri' 
	            value={this.state.apiUrl}
	            onChange={this.handleChange} />

              <OptionsPaneSection sectionTitle='JVM Runtime' errors={this.props.errors} listItems={jvmItems} />
              <OptionsPaneSection sectionTitle='Persistence' errors={this.props.errors} listItems={persistenceItems} />
              <OptionsPaneSection sectionTitle='Router' errors={this.props.errors} listItems={routerItems} />
              <OptionsPaneSection sectionTitle='Pulse elasticsearch' errors={this.props.errors} listItems={pulseItems} />
              <OptionsPaneSection sectionTitle='Container Driver' errors={this.props.errors} listItems={containerDriverItems} />

	          </form>
	        </div>
  		</aside>
  	);
  }

});

module.exports = OptionsPane;