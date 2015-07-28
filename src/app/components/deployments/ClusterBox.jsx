var React = require('react');
var ServicesList = require('./ServicesList.jsx');

var ClusterBox = React.createClass({

  updateClusterFilters: function(service, filters, weight){
    var currentCluster = this.props.name;
    this.props.onOptionsUpdate(currentCluster, service, filters, weight)
  },

  render: function() {

    var cluster = this.props.cluster;
    var name = this.props.name ;
    var clusterForService = {
      name: name, 
      port: Object.keys(this.props.cluster.routes)[0]
    }

    return(
      <div className='cluster-section'>
        <div className='cluster-name'>
          <h1>{name} <small className="muted">cluster</small></h1>
          <a className='add-link add-service-link hidden'>+ Add Service</a>
        </div>
        <div className='services-container'>                    
          <ServicesList services={cluster.services} cluster={clusterForService} serviceMetrics={this.props.serviceMetrics} updateClusterFilters={this.updateClusterFilters}/>    
        </div>
      </div>
    )}
});
 
module.exports = ClusterBox;
