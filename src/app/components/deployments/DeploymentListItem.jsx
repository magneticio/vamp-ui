var _ = require('underscore');
var cx = require('classnames');
var React = require('react');
var Router = require('react-router');
var Loader = require('../Loader.jsx');
var DeploymentActions = require('../../actions/DeploymentActions.js');
var HealthCircle = require('../HealthCircle.jsx');
var DropdownList = require('../DropdownList.jsx');

var DeploymentListItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  handleDetail: function() {
    this.context.router.transitionTo('deployment',{id: this.props.deployment.name});
  },
  handleDelete: function(e) {
    var el = e.currentTarget,
        className = 'active';

    if (confirm('Are you sure you want to undeploy this deployment?')) {
      mixpanel.track("Deployment undeployed");        
      DeploymentActions.deleteFullDeployment(this.props.deployment);
      el.classList ? el.classList.add(className) : el.className += ' ' + className;
    } else {
      el.classList ? el.classList.remove(className) : el.className += ' ' + className;
    }
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

    var deployment = this.props.deployment,
        endpoints = this.prepareMetaInformation(deployment.endpoints),
        clusters = this.prepareMetaInformation(deployment.clusters, 'key'),
        services = this.prepareServices(deployment.clusters);

    var loaderClasses = cx({
      'hide': deployment.status == 'CLEAN' ? true : false
    });
    var listItemClasses = cx({
      'list-item': true,
      'loading': deployment.status == 'CLEAN' ? false : true,
      'hidden': deployment.status == 'BADREQUEST' ? true : false
    });

    return (
      <li className={listItemClasses}>
        <Loader hidden={loaderClasses} />
        <div className="list-section section-fifth">
          <a className="item-link" onClick={this.handleDetail}>
            <p className="item-name">{deployment.name.split("-")[0]} ...</p>
          </a>
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
          <button className='button button-red' onClick={this.handleDelete}>Undeploy</button>
        </div>
      </li>
  )}
});
 
module.exports = DeploymentListItem;