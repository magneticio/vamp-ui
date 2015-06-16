var React = require('react/addons');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var BreedStore = require('../stores/BreedStore');
var BlueprintStore = require('../stores/BlueprintStore');
var DeploymentStore = require('../stores/DeploymentStore');
var BreedActions = require('../actions/BreedActions');
var BlueprintActions = require('../actions/BlueprintActions');
var DeploymentActions = require('../actions/DeploymentActions');
var BreedsList = require('./breeds/BreedsList.jsx');
var NavBar = require("../components/NavBar.jsx");
var LoadStates = require("../constants/LoadStates.js");

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
    }
  },
  componentDidMount: function() {
    BreedStore.addChangeListener(this._onChange);
    BlueprintStore.addChangeListener(this._onChange);
    DeploymentStore.addChangeListener(this._onChange);

    // get initial data
    BreedActions.getAllBreeds();
    BlueprintActions.getAllBlueprints();
    DeploymentActions.getAllDeployments();

    //schedule poller
    //this.setInterval(this.pollBackend, POLL_INTERVAL);
  },
  
  render: function() {
    var props = this.state;
    //console.log('master props', props);
    return (
      <div id="page-container">
        <header id="header">
            <NavBar tabs={allTabs} activeTabId={props.activeTabId} />
        </header>
        <div id="page-content">
          <RouteHandler {...props} />
        </div>
      </div>

    );
  },

  _onChange: function() {
    console.log('master onchange');
    this.setState(
      {
        allBreeds: BreedStore.getAll(),
        allBlueprints: BlueprintStore.getAll(),
        allDeployments: DeploymentStore.getAll(),
        loadState: LoadStates.STATE_SUCCESS
      }
    )
  }
});

module.exports = Master;