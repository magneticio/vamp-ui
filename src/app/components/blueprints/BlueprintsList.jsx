var React = require('react/addons');
var TransitionGroup = React.addons.CSSTransitionGroup;
var PureRenderMixin = React.addons.PureRenderMixin;
var SetIntervalMixin = require("../../mixins/SetIntervalMixin.js");
var _ = require('underscore');
var classNames = require('classnames');
var ToolBar = require('../ToolBar.jsx');
var LoadStates = require("../../constants/LoadStates.js");
var ButtonBar = require('./BlueprintsButtonBar.jsx');
var BlueprintListItem = require('./BlueprintListItem.jsx');
var BlueprintActions = require('../../actions/BlueprintActions');
var BlueprintStore = require('../../stores/BlueprintStore');


var BlueprintsList = React.createClass({
  
  mixins: [SetIntervalMixin],

  getInitialState: function() {
    return {
      filterText: '',
      viewType:'general-list',
      blueprintCount: 0,
      blueprintCreated: false,
      currentBlueprint: {},
      requestingBlueprint: false
    };
  },
  componentDidMount: function(){
    BlueprintActions.getAllBlueprints();
    this.setInterval(this.pollBackend, 4000);
  },
  componentWillReceiveProps: function(nextProps){
    var nextBlueprintCount = _.size(nextProps.allBlueprints);
    if(nextBlueprintCount > this.state.blueprintCount){
      this.setState({
        blueprintCount: nextBlueprintCount,
        blueprintCreated: true
      });
    } else if(nextBlueprintCount < this.state.blueprintCount) {
      this.setState({
        blueprintCount: nextBlueprintCount,
        blueprintCreated: false
      });
    } else {
      this.setState({ blueprintCreated: false });
    }
    if(this.state.requestingBlueprint){
      _currentBlueprint = BlueprintStore.getCurrentBlueprint();
      this.setState({ 
        currentBlueprint: _currentBlueprint,
        requestingBlueprint: _.isEmpty(_currentBlueprint) 
      });
    }
  },
  
  handleAdd: function(newBlueprint) {
    this.setState({ blueprintCreated: false});
    BlueprintActions.createBlueprint(newBlueprint);
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
  handleDetail: function(){
    this.setState({ requestingBlueprint: true });
  },
  clearCurrentBlueprint: function(){
    this.setState({ currentBlueprint: {} });
  },

  render: function() {

    // Set vars
    var allBlueprints = this.props.allBlueprints,
        blueprints = [],
        errorsToBeShown = this.props.errors['UNREACHABLE'] ? true : false,
        errorMessage = errorsToBeShown ? this.props.errors['UNREACHABLE'].message : '';

    // Prepare Blueprintslist
    _.each(allBlueprints, function(blueprint,key) {
      var filterTerm = this.state.filterText.toLowerCase() || false;
      if ( ( blueprint.name.toLowerCase().indexOf(filterTerm) === -1 && filterTerm) ) {
        return;
      }
      blueprints.push(<BlueprintListItem key={key} blueprint={allBlueprints[key]} handleDetail={this.handleDetail} />);
    }, this);
    
    // Prepare dynamic classes
    var loadingClassSet = classNames({
      "hidden": this.props.loadState !== LoadStates.STATE_LOADING
    });
    var emptyClassSet = classNames({
      "empty-list": true,
      "container-status-message": true,
      "hidden": blueprints.length > 0 || errorsToBeShown
    });
    var errorMessageClassSet = classNames({
      "error-status-message": true,
      "container-status-message": true,
      "hidden": !errorsToBeShown
    });
    var listHeaderClasses = classNames({
      "list-header": true,
      "hidden": blueprints.length <= 0
    });
    var listClasses = classNames( this.state.viewType, {
      'dimmed': this.props.errors['UNREACHABLE']
    });

    return(
      <div className='list-container'>
        <ToolBar 
          filterText={this.state.filterText}
          onUserInput={this.handleUserInput}
          handleViewSwitch={this.handleViewSwitch}
          handleAdd={this.handleAdd}
          addArtefactType='blueprint'
          requestResolved={this.state.blueprintCreated} 
          loadState={this.props.loadState}
          detailArtefact={this.state.currentBlueprint} 
          clearDetailArtefact={this.clearCurrentBlueprint} />
        <span className={emptyClassSet}>No blueprints found.</span>
        <span className={errorMessageClassSet}>{errorMessage}</span>        
        <TransitionGroup 
          id='blueprints-list' 
          component="ul" 
          transitionName="fadeIn" 
          transitionAppear={true} 
          transitionLeave={true} 
          className={listClasses}>
          <li className={listHeaderClasses}>
            <div className="list-section section-fifth">
              <h4>Blueprint</h4>
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
            <div className="list-section section-fifth list-actions">
            </div>
          </li>
          {blueprints}
        </TransitionGroup>
      </div>    
  )},

  pollBackend: function() {
    console.log('polling blueprints');
    BlueprintActions.getAllBlueprints();
  }
});
 
module.exports = BlueprintsList;