var React = require('react');
var _ = require('underscore');
var classnames = require('classnames');
var Loader = require('../Loader.jsx');
var BlueprintActions = require('../../actions/BlueprintActions.js');
var BlueprintStore = require('../../stores/BlueprintStore.js')
var DropdownList = require('../DropdownList.jsx');

var BlueprintListItem = React.createClass({

  // Etc
  contextTypes: {
    router: React.PropTypes.func
  },

  // Component lifecycle
  getInitialState: function(){
    return {
      deployRequestPending: false,
      deleteRequestPending: false,
      deployRequestError: false,
      deleteRequestError: false
    }
  },
  componentWillMount: function() {
    this.handleDeploy = _.debounce(this.handleDeploy,500);
  },
  componentWillReceiveProps: function(nextProps){
    // Wait with navigation until blueprint is accepted
    if(this.state.deployRequestPending && nextProps.blueprint.status == "ACCEPTED"){
      this.setState({ deployRequestPending: false });
      this.context.router.transitionTo('deployments');
    } 
    // Show error and cancel request when error is thrown
    if(this.state.deployRequestPending && nextProps.blueprint.status == "BADREQUEST"){
      var self = this;
      this.setState({ 
        deployRequestError: BlueprintStore.getError(),
        deployRequestPending: false
      });
      setTimeout(function(){
        self.setState({ deployRequestError: false });
      }, 5000);
    }
    // Catch react bug where no unique id's can be generated. Ask Daniel for more details
    if(this.props.blueprintCreated){
      this.setState({ deleteRequestPending: false });
    }
  },

  // Event handlers
  handleDetail: function(e) {
    e.preventDefault();
    mixpanel.track("Blueprint edit panel opened");        
    this.props.handleDetail(this.props.blueprint.name);
  },
  handleDeploy: function(e) {
    e.preventDefault();
    mixpanel.track("Blueprint deploy button clicked");        
    this.setState({ deployRequestPending: true });
    BlueprintActions.deployBlueprint(this.props.blueprint);
  },
  handleDelete: function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this blueprint?')) {
      mixpanel.track("Blueprint deleted");        
      this.setState({ deleteRequestPending: true });
      BlueprintActions.deleteBlueprint(this.props.blueprint);
    }
  },

  // Helpers
  prepareMetaInformation: function(metaInformation, storeType){
    var itemList = [];
    _.each(metaInformation, function(val,key){
      if(storeType == 'key')
        itemList.push(key);
      else
        itemList.push(val);
    });
    return itemList;
  },
  prepareServices: function(clusters){
    var servicesList = [];
    _.each(clusters, function(cluster,key){
      _.each(cluster.services, function(service,index){
        servicesList.push(service.breed.name);
      });
    });
    return servicesList;
  },

  // Render
  render: function() {

    // Set vars
    var blueprint = this.props.blueprint;
        endpoints = this.prepareMetaInformation(blueprint.endpoints),
        clusters = this.prepareMetaInformation(blueprint.clusters, 'key'),
        services = this.prepareServices(blueprint.clusters);    

    // Prepare dynamic classes
    var listClasses = classnames({
      'list-item': true,
      'hidden': this.state.deleteRequestPending
    });
    var loaderClasses = classnames({
      'hide': blueprint.status == 'CLEAN' ? true : false
    });
    var deployButtonClasses = classnames({
      'button': true,
      'button-ghost': true,
      'active': this.state.deployRequestPending
    });
    var deleteButtonClasses = classnames({
      'button': true,
      'button-red': true,
      'active': this.state.deleteRequestPending,
    });
    var dialogClasses = classnames('list-section', 'section-full', 'dialog', 'dialog-danger', 'dialog-fade', {
      hidden: !this.state.deployRequestError
    });

    return (
      <li className={listClasses}>
        <div className={dialogClasses}>
          <span className="clip-textoverflow">{this.state.deployRequestError}</span>
        </div>
        <div className="list-section section-fifth">
          <a onClick={this.handleDetail} className="editable"><p className="item-name clip-textoverflow">{blueprint.name}</p></a>
        </div>
        <div className="list-section section-fifth">
          <DropdownList items={endpoints} />
        </div>
        <div className="list-section section-fifth">
          <DropdownList items={clusters} />
        </div>
        <div className="list-section section-fifth">
          <DropdownList items={services} />
        </div>
        <div className="list-section section-fifth list-controls">
          <button className={deployButtonClasses} onClick={this.handleDeploy}>Deploy</button>
          <button className={deleteButtonClasses} onClick={this.handleDelete}>Delete</button>
        </div>
      </li>
  )}
});
 
module.exports = BlueprintListItem;