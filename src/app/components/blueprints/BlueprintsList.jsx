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

var BlueprintsList = React.createClass({
  
  mixins: [SetIntervalMixin],

  getInitialState: function() {
    return {
      filterText: '',
      viewType:'general-list',
      blueprintCount: 0,
      blueprintCreated: false,
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
    } else {
      this.setState({
        blueprintCreated: false
      });
    }
  },
  
  handleAdd: function(newBlueprint) {
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

  render: function() {

    var loadingClassSet = classNames({
      "hidden": this.props.loadState !== LoadStates.STATE_LOADING
    });

    var allBlueprints = this.props.allBlueprints;
    var blueprints = [];

    _.each(allBlueprints, function(blueprint,key) {
      var filterTerm = this.state.filterText.toLowerCase() || false;
      if ( ( blueprint.name.toLowerCase().indexOf(filterTerm) === -1 && filterTerm) ) {
        return;
      }
      blueprints.push(<BlueprintListItem key={key} blueprint={allBlueprints[key]} />);
    }, this);

    blueprints = blueprints.reverse();

    var emptyClassSet = classNames({
      "empty-list": true,
      "hidden": blueprints.length > 0
    });
    var listHeaderClasses = classNames({
      "list-header": true,
      "hidden": blueprints.length <= 0
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
          loadState={this.props.loadState} />
        <span className={emptyClassSet}>No blueprints found.</span>
        <TransitionGroup 
          id='blueprints-list' 
          component="ul" 
          transitionName="fadeIn" 
          transitionAppear={true} 
          transitionLeave={true} 
          className={this.state.viewType}>
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