var React = require('react');
var classNames = require('classnames');
var ServicesList = require('./ServicesList.jsx');
var ClusterSettingsBox = require('./ClusterSettingsBox.jsx');

var ClusterBox = React.createClass({

  // Component lifecycle
  getInitialState: function(){
    return {
      activeCluster: false
    }
  },
  componentWillReceiveProps: function(nextProps){
    if(!nextProps.editServiceActive)
      this.setState({ activeCluster: false });
  },

  // Event handlers
  updateClusterFilters: function(service, filters, weight){
    var currentCluster = this.props.name;
    this.props.onOptionsUpdate(currentCluster, service, filters, weight)
  },
  handleEditWeight: function(){
    this.state.activeCluster ? this.setState({ activeCluster: false }) : this.setState({ activeCluster: true });
    this.props.handleEditWeight();
  },

  // Render
  render: function() {

    var cluster = this.props.cluster;
    var name = this.props.name ;
    var clusterForService = {
      name: name, 
      port: Object.keys(this.props.cluster.routes)[0]
    }

    // Dynamic classes
    var clusterNameClasses = classNames('cluster-name', {
      'active': this.props.editServiceActive && this.state.activeCluster
    });

    return(
      <div className='cluster-section'>
        <div className={clusterNameClasses}>
          <h1>{name} <small className="muted">cluster</small></h1>
          <a className='add-link add-service-link hidden'>+ Add Service</a>
        </div>

        <ClusterSettingsBox 
          services={cluster.services}
          editServiceActive={this.props.editServiceActive} 
          handleEditWeight={this.handleEditWeight}
          activeCluster={this.state.activeCluster} />
        
        <div className='services-container'>                    
          <ServicesList 
            services={cluster.services} 
            cluster={clusterForService} 
            serviceMetrics={this.props.serviceMetrics} 
            updateClusterFilters={this.updateClusterFilters} 
            handleEditWeight={this.handleEditWeight} />    
        </div>
      </div>
    )}
});
 
module.exports = ClusterBox;
