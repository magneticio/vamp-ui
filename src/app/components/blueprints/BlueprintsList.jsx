var React = require('react/addons');
var TransitionGroup = React.addons.CSSTransitionGroup;
var PureRenderMixin = React.addons.PureRenderMixin;
var SetIntervalMixin = require("../../mixins/SetIntervalMixin.js");
var _ = require('underscore');
var classNames = require('classnames');
var ToolBar = require('../toolbar/ToolBar.jsx');
var LoadStates = require("../../constants/LoadStates.js");
var ButtonBar = require('./BlueprintsButtonBar.jsx');
var BlueprintListItem = require('./BlueprintListItem.jsx');
var BlueprintActions = require('../../actions/BlueprintActions');
var BlueprintStore = require('../../stores/BlueprintStore');


var BlueprintsList = React.createClass({

  // Etc
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins: [SetIntervalMixin],

  // Component lifecycle
  getInitialState: function() {
    return {
      filterText: '',
      viewType:'general-list',
      blueprintCreated: false,
      currentBlueprint: {},
      currentBlueprintcount: 0,
      requestingBlueprint: false,
      blueprintName: '',
      crudType: '',
      pending: false,
    };
  },
  componentDidMount: function(){
    if(this.context.router.getCurrentParams().id)
      this.handleDetail(this.context.router.getCurrentParams().id);

    BlueprintActions.getAllBlueprints();
    this.setInterval(this.pollBackend, 4000);
  },
  componentWillReceiveProps: function(nextProps){
    if(this.state.pending){
      var newBlueprint = BlueprintStore.getCurrentBlueprint(),
          nextBlueprintCount = _.size(nextProps.allBlueprints);

      if(this.state.crudType == 'update' && this.state.currentBlueprint != newBlueprint){
        this.setState({ pending: false, blueprintCreated: true, currentBlueprint: {} });
        BlueprintStore.clearCurrentBlueprint();
      } 
      if(this.state.crudType == 'create' && this.state.currentBlueprintcount < nextBlueprintCount){
        this.setState({ pending: false, blueprintCreated: true, currentBlueprint: {}, crudType:'' });
        BlueprintStore.clearCurrentBlueprint();
      }
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
  
  // Event handlers
  handleAdd: function(newBlueprint) {
    this.setState({ blueprintCreated: false, pending: true, crudType:'create', currentBlueprintcount: _.size(this.props.allBlueprints)});
    BlueprintActions.createBlueprint(newBlueprint);
  },
  handleUpdate: function(blueprint) {
    this.setState({ blueprintCreated: false, pending: true, crudType:'update'});
    BlueprintActions.updateBlueprint(blueprint, this.state.blueprintName, 'application/x-yaml');
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
  handleDetail: function(blueprintName){
    BlueprintStore.clearCurrentBlueprint();
    BlueprintActions.getBlueprint(blueprintName, 'application/x-yaml');
    this.setState({ requestingBlueprint: true, blueprintName: blueprintName });
  },
  clearCurrentBlueprint: function(){
    this.setState({ currentBlueprint: {}, blueprintName: '' });
  },

  // Render
  render: function() {

    // Set vars
    var allBlueprints = this.props.allBlueprints,
        blueprints = [],
        errorsToBeShown = this.props.errors['UNREACHABLE'] ? true : false,
        errorMessage = errorsToBeShown ? this.props.errors['UNREACHABLE'].message : '',
        i = 0;

    // Prepare Blueprintslist
    _.each(allBlueprints, function(blueprint,key) {
      var filterTerm = this.state.filterText.toLowerCase() || false;
      if ( ( blueprint.name.toLowerCase().indexOf(filterTerm) === -1 && filterTerm) ) {
        return;
      }
      blueprints.push(<BlueprintListItem key={key} blueprint={allBlueprints[key]} handleDetail={this.handleDetail} blueprintCreated={this.state.blueprintCreated}/>);
    }, this);
    
    // Prepare dynamic classes
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
          onUserInput={this.handleUserInput}
          handleViewSwitch={this.handleViewSwitch}
          handleAdd={this.handleAdd}
          handleUpdate={this.handleUpdate}
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
    BlueprintActions.getAllBlueprints();
  }
});
 
module.exports = BlueprintsList;