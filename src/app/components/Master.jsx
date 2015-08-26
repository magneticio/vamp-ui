var React = require('react/addons');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var AppStore = require('../stores/AppStore');
var BreedStore = require('../stores/BreedStore');
var BlueprintStore = require('../stores/BlueprintStore');
var DeploymentStore = require('../stores/DeploymentStore');
var AppActions = require('../actions/AppActions');
var BreedActions = require('../actions/BreedActions');
var BlueprintActions = require('../actions/BlueprintActions');
var DeploymentActions = require('../actions/DeploymentActions');
var BreedsList = require('./breeds/BreedsList.jsx');
var NavBar = require("../components/NavBar.jsx");
var LoadStates = require("../constants/LoadStates.js");
var OptionsPane = require('./OptionsPane.jsx');
var classNames = require('classnames');
var Config = require('../config.js');

var allTabs = [
  {id: "/deployments", text: "Deployments"},
  {id: "/blueprints", text: "Blueprints"},
  {id: "/breeds", text: "Breeds"},
];

var POLL_INTERVAL = 4000;

var Master = React.createClass({
  
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return  {
      loadState: LoadStates.STATE_LOADING,
      allBreeds: [],
      activeTabId: '/deployments',
      isOptionsPaneOpened: false,
      errors: {}
    }
  },
  componentDidMount: function() {
    AppActions.getInfo();
    
    BreedStore.addChangeListener(this._onChange);
    BlueprintStore.addChangeListener(this._onChange);
    DeploymentStore.addChangeListener(this._onChange);
    AppStore.addChangeListener(this._onChange);

    // get initial data
    BreedActions.getAllBreeds();
    BlueprintActions.getAllBlueprints();
    DeploymentActions.getAllDeployments();
  },

  togglePageContent: function(){
    mixpanel.track("Options pane toggled");        
    this.setState({
      isOptionsPaneOpened: this.state.isOptionsPaneOpened ? false : true
    });
  },
  
  render: function() {
    
    var pageContentClasses = classNames({
      'options-pane-opened': this.state.isOptionsPaneOpened
    });
    var props = this.state;

    return (
      <div id="page-container" className={pageContentClasses}>
        <div className="wrapper">
          <header id="header">
              <NavBar tabs={allTabs} activeTabId={props.activeTabId} togglePageContent={this.togglePageContent} errors={this.state.errors} />
          </header>
          <div id="page-content">
            <RouteHandler {...props} />
          </div>
        </div>
        <OptionsPane togglePageContent={this.togglePageContent} apiInfo={this.state.apiInfo} errors={this.state.errors} />
      </div>
    );
  },

  _onChange: function() {
    this.setState(
      {
        allBreeds: BreedStore.getAll(),
        allBlueprints: BlueprintStore.getAll(),
        allDeployments: DeploymentStore.getAll(),
        apiInfo: AppStore.getInfo(),
        errors: AppStore.getErrors(),
        loadState: LoadStates.STATE_SUCCESS
      }
    )
  }
});

module.exports = Master;