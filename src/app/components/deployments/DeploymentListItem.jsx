var _ = require('underscore');
var React = require('react');
var Router = require('react-router');
var Loader = require('../Loader.jsx');
var Badge = require('../Badge.jsx');
var DeploymentActions = require('../../actions/DeploymentActions.js');
var HealthCircle = require('../HealthCircle.jsx');

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

    el.classList ? el.classList.add(className) : el.className += ' ' + className;

    DeploymentActions.deleteFullDeployment(this.props.deployment);
  },

  render: function() {

    var deployment = this.props.deployment;
    var clusterCountTotal = _.keys(deployment.clusters).length
    var servicesCountTotal = _.reduce(deployment.clusters, function(memo,cluster){
        return memo + cluster.services.length
    }, 0);
    var randomkey = Math.floor( Math.random() * 1000 );

    return (
      <li className="list-item">
        <span className={ (deployment.status == 'CLEAN' ? 'hidden' : '') }>
          <Loader />
        </span>
        <div className="list-section section-fifth">
          <a onClick={this.handleDetail}>
            <p className="item-name">{deployment.name.split("-")[0]} ...</p>
          </a>
        </div>
        <div className="list-section section-fifth">
          some endpoints here
        </div>
        <div className="list-section section-fifth">
          Front-end and {clusterCountTotal} more
        </div>
        <div className="list-section section-fifth">
          monarch_front:0.1 and {servicesCountTotal} more
        </div>
        <div className="list-section section-fifth list-controls">
          <button className='button button-red' onClick={this.handleDelete}>Undeploy</button>
        </div>
      </li>
  )}
});
 
module.exports = DeploymentListItem;