var _ = require('underscore')
var React = require('react');
var Router = require('react-router')
var Loader = require('./Loader.jsx')
var DeploymentActions = require('../actions/DeploymentActions.js')
var HealthCircle = require('./HealthCircle.jsx')
var DeploymentListItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  handleDetail: function () {
    this.context.router.transitionTo('deployment',{id: this.props.deployment.name})
  },
  handleDelete: function () {
    DeploymentActions.deleteFullDeployment(this.props.deployment)
  },

  render: function() {

    var deployment = this.props.deployment;
    var clusterCountTotal = _.keys(deployment.clusters).length
    var servicesCountTotal = _.reduce(deployment.clusters, function(memo,cluster){
        return memo + cluster.services.length
    },0)

    return (
      <tr>
        <td>
          <span className={ (deployment.status == 'CLEAN' ? 'hidden' : '') }>
            <Loader />
          </span>   
          <a>            
            <div onClick={this.handleDetail} className='artifact-name clip-names'>  {deployment.name}</div>         
          </a>
        </td>
        <td><HealthCircle state='green'/></td>
        <td>{clusterCountTotal}</td>
        <td>{servicesCountTotal}</td>
        <td>
          <div className='button-bar'>
            <button className='btn btn-danger' onClick={this.handleDelete}>Delete</button>
          </div>        
        </td>
      </tr>
  )}
});
 
module.exports = DeploymentListItem;