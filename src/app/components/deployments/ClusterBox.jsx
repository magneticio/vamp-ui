var React = require('react');
var ServicesList = require('./ServicesList.jsx');
var Badge = require('../Badge.jsx');

var ClusterBox = React.createClass({

  render: function() {

    var cluster = this.props.cluster;
    var name = this.props.name  ;
    var port = "<Badge label='port' port={cluster.routes} />";

    return(
      <div className='cluster-box'>
        <div className='cluster-name'>
          <h1>{name} <small className="muted">cluster</small></h1>
          <a className='add-link add-service-link'>+ Add Service</a>
        </div>
        <hr/>
        <div className='services-container'>                    
          <ServicesList services={cluster.services}/>    
        </div>
      </div>
    )}
});
 
module.exports = ClusterBox;
