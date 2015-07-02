var React = require('react/addons');
var TransitionGroup = React.addons.CSSTransitionGroup;
var PureRenderMixin = React.addons.PureRenderMixin;
var SetIntervalMixin = require("../../mixins/SetIntervalMixin.js");
var _ = require('underscore');
var classNames = require('classnames');
var ToolBar = require('../ToolBar.jsx');
var LoadStates = require("../../constants/LoadStates.js");
var DeploymentListItem = require('./DeploymentListItem.jsx');
var DeploymentActions = require('../../actions/DeploymentActions');
var AppStore = require('../../stores/AppStore');

var DeploymentsList = React.createClass({

  mixins: [SetIntervalMixin],

  getInitialState: function() {
    return {
      filterText: '',
      viewType:'general-list',
      errors: [],
    };
  },
  componentDidMount: function(){
    this.setInterval(this.pollBackend, 4000);
    this.setState({ errors: AppStore.getErrors() });
  },
  
  handleAdd: function() {
    console.log('handle add')
  },
  handleUserInput: function(filterText) {
    this.setState({
      filterText: filterText,
    });
  },
  handleViewSwitch: function(viewType) {
    this.setState({
      viewType: viewType,
    });
  },

  render: function() {

    // Set vars
    var allDeployments = this.props.allDeployments,
        deployments = [],
        errorsToBeShown = _.size(this.state.errors) > 0 ? true : false,
        errorMessages = [];

    // Prepare Deploymentslist
    _.each(allDeployments, function(deployment,key) {
      var filterTerm = this.state.filterText.toLowerCase() || false;
      if ( ( deployment.name.toLowerCase().indexOf(filterTerm) === -1 && filterTerm) ) {
        return;
      }
      deployments.push(<DeploymentListItem key={key} deployment={allDeployments[key]} />);
    }, this);

    // Format errors
    if(errorsToBeShown) {
      _.each(this.state.errors, function(error, key){
        errorMessages.push(error.message);
      }, this);
    }

    // Prepare dynamic classes
    var loadingClassSet = classNames({
      "hidden": this.props.loadState !== LoadStates.STATE_LOADING
    });
    var emptyClassSet = classNames({
      "empty-list": true,
      "container-status-message": true,
      "hidden": deployments.length > 0 || errorsToBeShown
    });
    var errorMessageClassSet = classNames({
      "error-status-message": true,
      "container-status-message": true,
      "hidden": !errorsToBeShown
    });
    var listHeaderClasses = classNames({
      "list-header": true,
      "hidden": deployments.length <= 0
    });

    return(
      <div className='list-container'>
        <ToolBar 
          filterText={this.state.filterText}
          onUserInput={this.handleUserInput}
          handleViewSwitch={this.handleViewSwitch} />
        <span className={emptyClassSet}>No running deployments.</span>
        <span className={errorMessageClassSet}>{errorMessages}</span>
        <TransitionGroup 
          id='deployments-list' 
          component="ul" 
          transitionName="fadeIn" 
          transitionAppear={true} 
          transitionLeave={true}
          className={this.state.viewType}>
          <li className={listHeaderClasses}>
            <div className="list-section section-fifth">
              <h4>Deployment</h4>
            </div>
            <div className="list-section section-fifth">
              <h4>Endpoints</h4>
            </div>
            <div className="list-section section-fifth">
              <h4>Clusters</h4>
            </div>
            <div className="list-section section-fifth">
              <h4>Services</h4>
            </div>
            <div className="list-section section-fifth">
            </div>
          </li>
          {deployments}
        </TransitionGroup>
      </div>
  )},

  pollBackend: function() {
    console.log('polling deployments');
    DeploymentActions.getAllDeployments();
  }
});
 
module.exports = DeploymentsList;