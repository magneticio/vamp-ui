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

  handleDetail: function () {
    this.context.router.transitionTo('deployment',{id: this.props.deployment.name})
  },
  handleDelete: function () {
    console.log('delete');
    DeploymentActions.deleteFullDeployment(this.props.deployment)
  },

  render: function() {

    var deployment = this.props.deployment;
    var clusterCountTotal = _.keys(deployment.clusters).length
    var servicesCountTotal = _.reduce(deployment.clusters, function(memo,cluster){
        return memo + cluster.services.length
    },0)
    var randomkey = Math.floor( Math.random() * 1000 );

    return (
      <li className="list-item">
        <span className={ (deployment.status == 'CLEAN' ? 'hidden' : '') }>
          <Loader />
        </span>
        <div className="list-section section-half">
          <HealthCircle state='green'/>
          <a onClick={this.handleDetail}><p className="item-name">{deployment.name}</p></a>
        </div>
        <div className="list-section section-sixth">
          {clusterCountTotal}
        </div>
        <div className="list-section section-sixth">
          {servicesCountTotal}
        </div>
        <div className="list-section section-sixth list-controls">
          <button className='button button-red' onClick={this.handleDelete}>Undeploy</button>
        </div>
      </li>
  )}
});
 
module.exports = DeploymentListItem;