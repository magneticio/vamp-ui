var React = require('react/addons');
var Config = require('../config.js');
var AppActions = require('../actions/AppActions');
var BreedActions = require('../actions/BreedActions');
var BlueprintActions = require('../actions/BlueprintActions');
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
    Config.setApiHost(this.state.apiUrl, function(){
      AppActions.getInfo();
      BreedActions.getAllBreeds();
      BlueprintActions.getAllBlueprints();
    });
  },
  handleChange: function(e){
    this.setState({apiUrl: e.target.value});
  },

  render: function(){

    var formattedInfoObject = {},
        apiInfo = this.props.apiInfo || {},
        containerMessage = '',
        vampVersion = '',
        jvmItems = {},
        persistenceItems = {},
        routerItems = {},
        pulseItems = {},
        containerDriverItems = {},
        errorFlag = false;

    if( _.isEmpty(apiInfo) || !_.isEmpty(this.props.errors) ){
      if(this.props.errors['UNREACHABLE'])
        containerMessage = "It seems the api can't be reached, we're sorry";

      if(this.props.errors['INTERNAL'])
        containerMessage = "Some services are down, please check the status of VAMP";
    } else {
      containerMessage = apiInfo.message;
      vampVersion = apiInfo.version;
    }

    // Filter trough info endpoint, set vars.
    try {
      var _starttime = new Date(apiInfo.jvm.runtime.start_time);
      jvmItems['starttime'] = _starttime.toUTCString().substring(0, 16);
      jvmItems['uptime-calculated'] = _starttime; // Uptime value gets calculated in OptionsPaneSection
    } catch(e) {
      jvmItems = {};
      jvmItems['error'] = 'Internal error';
      AppStore.putError('INTERNAL', 'Something went wrong while checking the status of services');
      errorFlag = true;
    }
    try {
      persistenceItems['type'] = apiInfo.persistence.type;
      persistenceItems['url'] = apiInfo.persistence.url;
      persistenceItems['database'] = apiInfo.persistence.database;
    } catch(e) {
      persistenceItems = {};
      persistenceItems['error'] = 'Internal error';
      AppStore.putError('INTERNAL', 'Something went wrong while checking the status of services');
      errorFlag = true;
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
      AppStore.putError('INTERNAL', 'Something went wrong while checking the status of services');
      errorFlag = true;
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
      AppStore.putError('INTERNAL', 'Something went wrong while checking the status of services');
      errorFlag = true;
    }
    try {
      containerDriverItems['type'] = apiInfo.container_driver.type;
    } catch(e) {
      containerDriverItems = {};
      containerDriverItems['error'] = 'Internal error';
      AppStore.putError('INTERNAL', 'Something went wrong while checking the status of services');
      errorFlag = true;
    }

    if(!errorFlag){
      AppStore.deleteError('INTERNAL');
    }

    var inputClasses = classNames({
      'danger': 'UNREACHABLE' in this.props.errors ? true : false,
    });

    var restApiTitleClasses = classNames({
      'error-badge': 'UNREACHABLE' in this.props.errors ? true : false,
    });
    
  	return (
  		<aside className='options-pane'>
  			<div className='inner-options-pane'>
	  			<form onSubmit={this.handleSubmit} className='options-form'>

            <h3>{containerMessage}</h3>
            <h4>Version</h4>
            {vampVersion}

            <h4 className={restApiTitleClasses}>REST API URL</h4>
	          <input 
	            type='text'
              name='vamp_uri' 
              className={inputClasses}
	            value={this.state.apiUrl}
	            onChange={this.handleChange} />

              <OptionsPaneSection sectionTitle='JVM Runtime' errors={this.props.errors} listItems={jvmItems}/>
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