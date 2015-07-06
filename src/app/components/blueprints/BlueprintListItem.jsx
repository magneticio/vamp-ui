var React = require('react');
var _ = require('underscore');
var cx = require('classnames');
var Loader = require('../Loader.jsx')
var BlueprintActions = require('../../actions/BlueprintActions.js')
var DropdownList = require('../DropdownList.jsx');

var BlueprintListItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function(){
    return {
      deployRequestPending: false,
      deleteRequestPending: false,
      deleteRequestError: false
    }
  },
  componentWillReceiveProps: function(nextProps){
    console.log(nextProps.blueprint.name);
    if(this.state.deployRequestPending && nextProps.blueprint.status == "ACCEPTED"){
      this.setState({ deployRequestPending: false });
      this.context.router.transitionTo('deployments');
    }
    if(this.state.deleteRequestPending && nextProps.blueprint.status == "DELETE_ERROR"){
      this.setState({ 
        deleteRequestPending: false, 
        deleteRequestError: true 
      });
    }
  },

  handleDetail: function(e) {
    e.preventDefault();
    this.context.router.transitionTo('blueprint',{id: this.props.blueprint.name});
  },
  handleDeploy: function(e) {
    this.setState({ deployRequestPending: true });
    BlueprintActions.deployBlueprint(this.props.blueprint);
  },
  handleDelete: function(e) {
    this.setState({ deleteRequestPending: true });
    BlueprintActions.deleteBlueprint(this.props.blueprint);
  },

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
    _.each(clusters, function(val,key){
      _.each(val.services, function(val,key){
        servicesList.push(val.breed.name);
      });
    });
    return servicesList;
  },

  render: function() {

    var blueprint = this.props.blueprint;
        endpoints = this.prepareMetaInformation(blueprint.endpoints),
        clusters = this.prepareMetaInformation(blueprint.clusters, 'key'),
        services = this.prepareServices(blueprint.clusters);    

    var listClasses = cx({
      'list-item': true,
      'hidden': this.state.deleteRequestPending
    });
    var loaderClasses = cx({
      'hide': blueprint.status == 'CLEAN' ? true : false
    });
    var deployButtonClasses = cx({
      'button': true,
      'button-ghost': true,
      'active': this.state.deployRequestPending
    });
    var deleteButtonClasses = cx({
      'button': true,
      'button-red': true,
      'active': this.state.deleteRequestPending,
    });

    return (
      <li className={listClasses}>
        <div className="list-section section-fifth">
          <a onClick={this.handleDetail}><p className="item-name">{blueprint.name}</p></a>
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