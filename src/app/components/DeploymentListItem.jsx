var _ = require('underscore')
var React = require('react');
var Router = require('react-router')
var DeploymentListItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  onClick: function () {
    this.context.router.transitionTo('deployment',{id: this.props.deployment.name})
  },

  render: function() {

    var deployment = this.props.deployment;
    var clusterCountTotal = _.keys(deployment.clusters).length
    var servicesCountTotal = _.reduce(deployment.clusters, function(memo,cluster){
        return memo + cluster.services.length
    },0)

    console.log('service count: ' + servicesCountTotal)
    return (
      <tr onClick={this.onClick}>
        <td className="clip-names">
          {deployment.name}
        </td>
        <td>
        </td>
        <td>{clusterCountTotal}</td> 
        <td>{servicesCountTotal}</td>
        <td>
        </td>        
      </tr>
  )}
});
 
module.exports = DeploymentListItem;