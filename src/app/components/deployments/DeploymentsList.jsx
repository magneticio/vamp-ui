var React = require('react/addons');
var TransitionGroup = React.addons.CSSTransitionGroup;
var PureRenderMixin = React.addons.PureRenderMixin;
var SetIntervalMixin = require("../../mixins/SetIntervalMixin.js");
var _ = require('underscore');
var classNames = require('classnames');
var ToolBar = require('../toolbar/ToolBar.jsx');
var LoadStates = require("../../constants/LoadStates.js");
var DeploymentListItem = require('./DeploymentListItem.jsx');
var DeploymentActions = require('../../actions/DeploymentActions');
var AppStore = require('../../stores/AppStore');

var DeploymentsList = React.createClass({

  // Etc
  mixins: [SetIntervalMixin],

  // Component lifecylce
  getInitialState: function() {
    return {
      filterText: '',
      viewType:'general-list',
    };
  },
  componentDidMount: function(){
    this.setInterval(this.pollBackend, 4000);
  },

  // Event handlers  
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

  // Render
  render: function() {

    // Set vars
    var allDeployments = this.props.allDeployments,
        deployments = [],
        errorsToBeShown = this.props.errors['UNREACHABLE'] ? true : false,
        errorMessage = errorsToBeShown ? this.props.errors['UNREACHABLE'].message : '';

    // Prepare Deploymentslist
    _.each(allDeployments, function(deployment,key) {
      var filterTerm = this.state.filterText.toLowerCase() || false;
      if ( ( deployment.name.toLowerCase().indexOf(filterTerm) === -1 && filterTerm) ) {
        return;
      }
      deployments.push(<DeploymentListItem key={key} deployment={allDeployments[key]} />);
    }, this);

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
    var listClasses = classNames( this.state.viewType, {
      'dimmed': this.props.errors['UNREACHABLE']
    });
    
    return(
      <div className='list-container'>
        <ToolBar 
          filterText={this.state.filterText}
          onUserInput={this.handleUserInput}
          handleViewSwitch={this.handleViewSwitch} />
        <span className={emptyClassSet}>No running deployments found.</span>
        <span className={errorMessageClassSet}>{errorMessage}</span>
        <TransitionGroup 
          id='deployments-list' 
          component="ul" 
          transitionName="fadeIn" 
          transitionAppear={true} 
          transitionLeave={true}
          className={listClasses}>
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
    DeploymentActions.getAllDeployments();
  }
});
 
module.exports = DeploymentsList;