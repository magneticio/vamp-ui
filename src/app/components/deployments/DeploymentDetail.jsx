var _ = require('underscore')
var React = require('react');
var BreadCrumbsBar = require('../BreadCrumbsBar.jsx');
var ClusterBox = require('../ClusterBox.jsx');
var DeploymentActions = require('../../actions/DeploymentActions');
var LoadStates = require("../../constants/LoadStates.js");
var DeploymentStore = require('../../stores/DeploymentStore');

var DeploymentDetail = React.createClass({


  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return  {
      loadState: LoadStates.STATE_LOADING,
      deployment: {}
    }
  },

  componentDidMount: function() {
    DeploymentStore.addChangeListener(this._onChange);
    var name = this.context.router.getCurrentParams().id
    DeploymentActions.getDeployment(name)
  },

  componentWillUnmount: function() {
    DeploymentStore.removeChangeListener(this._onChange);
  },

  handleSubmit: function() {
    console.log(this.props)
    this.props.getDeploymentDetails
  },
  
  render: function() {

    deployment = this.state.deployment

    //grab the endpoint
    var endpoints = [] 
    _.each(deployment.endpoints,function(val,key){
      endpoints.push(<div><h6 key={key} className='text-muted'>- {key}: {val}</h6></div>)
    });

    // push cluster into an array
    var clusters = []    
    _.chain(deployment.clusters)
      .pairs()
      .each(function(item,idx){
        clusters.push(<ClusterBox key={item[0]} name={item[0]} cluster={item[1]} />);
      }).value()

    return(
      <div className='col-md-12 deployments'>
        <BreadCrumbsBar/>
        <div className='detail-section'>
          <h5>Endpoints</h5>
          <hr/>
          {endpoints}
        </div>
        <div className='detail-section'>
            {clusters}
        </div>
      </div>
  )},

 _onChange: function() {
    this.setState(
      {
        deployment: DeploymentStore.getCurrent(),
      }
    )
  }
});
 
module.exports = DeploymentDetail;