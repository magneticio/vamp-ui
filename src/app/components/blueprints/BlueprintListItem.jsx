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

  handleDetail: function(e) {
    e.preventDefault();
    this.context.router.transitionTo('blueprint',{id: this.props.blueprint.name});
  },
  handleDeploy: function(e) {
     var el = e.currentTarget,
        className = 'active',
        self = this;

    el.classList ? el.classList.add(className) : el.className += ' ' + className;
    BlueprintActions.deployBlueprint(this.props.blueprint);
    self.context.router.transitionTo('deployments');
  },
  handleDelete: function(e) {
    var el = e.currentTarget,
        className = 'active',
        self = this;

    el.classList ? el.classList.add(className) : el.className += ' ' + className;

    setTimeout(function(){
      BlueprintActions.deleteBlueprint(self.props.blueprint);
    }, 200);
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


    var loaderClasses = cx({
      'hide': blueprint.status == 'CLEAN' ? true : false
    });

    return (
      <li className="list-item">
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
          <button className='button button-ghost' onClick={this.handleDeploy}>Deploy</button>
          <button className='button button-red' onClick={this.handleDelete}>Delete</button>
        </div>
      </li>
  )}
});
 
module.exports = BlueprintListItem;