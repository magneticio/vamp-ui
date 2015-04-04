var React = require('react/addons');
var DeploymentListItem = require('./DeploymentListItem.jsx');
var LoadStates = require("../constants/LoadStates.js");

var DeploymentsList = React.createClass({
  render: function() {

      var loadingClassSet = React.addons.classSet({
        "hidden": this.props.loadState !== LoadStates.STATE_LOADING
      });

      var allDeployments = this.props.allDeployments;
      var deployments = [];

      for (var key in allDeployments) {
        deployments.push(<DeploymentListItem key={key} deployment={allDeployments[key]} />);
      }

    return(
      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Status</th>
              <th>Clusters</th>
              <th>Services</th>
              <th>SLA</th>
            </tr>
          </thead>
          <tbody>
            <tr className={loadingClassSet}>
              <td className="text-center" colSpan="5">
                <h6>Loading deployments...</h6>
              </td>
            </tr>
            {deployments}
          </tbody>
        </table>
      </div>  

  )}
});
 
module.exports = DeploymentsList;