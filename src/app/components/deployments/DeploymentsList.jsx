var React = require('react/addons');
var DeploymentListItem = require('./DeploymentListItem.jsx');
var LoadStates = require("../../constants/LoadStates.js");
var classNames = require('classnames');

var DeploymentsList = React.createClass({
  render: function() {

      var allDeployments = this.props.allDeployments;
      var deployments = [];

      var loadingClassSet = classNames({
        "hidden": this.props.loadState !== LoadStates.STATE_LOADING
      });


      for (var key in allDeployments) {
        deployments.push(<DeploymentListItem key={key} deployment={allDeployments[key]} />);
      }

      var emptyClassSet = classNames({
        "hidden": deployments.length > 0
      });


    return(
      <div className=''>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>name</th>
              <th>status</th>
              <th>clusters</th>
              <th>services</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr className={emptyClassSet}>
              <td colSpan="5" className='text-center'>
                No running deployments.
              </td>
            </tr>
            {deployments}
          </tbody>
        </table>
      </div>  

  )}
});
 
module.exports = DeploymentsList;