var React = require('react');
var ServicesList = require('./ServicesList.jsx');

var ClusterBox = React.createClass({

  render: function() {

    var cluster = this.props.cluster
    var name = this.props.name  

    return(
      <div className='cluster-box'>
        <h5>Cluster: {name} <small className="text-muted">port: {cluster.routes}</small></h5>
        <hr/>
          <div className='row'>                    
            <ServicesList services={cluster.services}/>    
          </div>
      </div>
    )}
});
 
module.exports = ClusterBox;
