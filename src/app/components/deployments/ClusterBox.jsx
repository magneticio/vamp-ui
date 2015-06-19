var React = require('react');
var ServicesList = require('./ServicesList.jsx');

var ClusterBox = React.createClass({

  updateClusterFilters: function(service, filters, weight){
    var currentCluster = this.props.name;
    this.props.onOptionsUpdate(currentCluster, service, filters, weight)
  },

  componentWillUnmount: function() {
    console.log('Clusters will unmount');
    // DeploymentStore.removeChangeListener(this._onChange);
  },

  render: function() {

    var cluster = this.props.cluster;
    var name = this.props.name ;
    var port = "<Badge label='port' port={cluster.routes} />";
    var clusterForService = {
      name: name, 
      port: Object.keys(this.props.cluster.routes)[0]
    }

    return(
      <div className='cluster-box'>
        <div className='cluster-name'>
          <h1>{name} <small className="muted">cluster</small></h1>
          <a className='add-link add-service-link hidden'>+ Add Service</a>
        </div>
        <hr/>
        <div className='services-container'>                    
          <ServicesList services={cluster.services} cluster={clusterForService} serviceMetrics={this.props.serviceMetrics} updateClusterFilters={this.updateClusterFilters}/>    
        </div>
      </div>
    )}
});
 
module.exports = ClusterBox;
