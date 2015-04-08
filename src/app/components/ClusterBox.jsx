var React = require('react');
var ServicesList = require('./ServicesList.jsx');

var ClusterBox = React.createClass({

  render: function() {

    var cluster = this.props.cluster
    var name = this.props.name  

    return(
      <div>
        <h5>Cluster: {name}</h5>
        <hr/>
          <div className='row'>                    
            <ServicesList services={cluster.services}/>    
          </div>
      </div>
    )}
});
 
module.exports = ClusterBox;
