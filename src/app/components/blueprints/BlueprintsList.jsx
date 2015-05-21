var React = require('react/addons');
var BlueprintActions = require('../../actions/BlueprintActions');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var ButtonBar = require('./BlueprintsButtonBar.jsx');
var BlueprintListItem = require('./BlueprintListItem.jsx');
var LoadStates = require("../../constants/LoadStates.js");

var BlueprintsList = React.createClass({

  render: function() {

      var loadingClassSet = React.addons.classSet({
        "hidden": this.props.loadState !== LoadStates.STATE_LOADING
      });

      var allBlueprints = this.props.allBlueprints;
      var blueprints = [];

      for (var key in allBlueprints) {
        blueprints.push(<BlueprintListItem key={key} blueprint={allBlueprints[key]} />);
      }

      var emptyClassSet = React.addons.classSet({
        "hidden": blueprints.length > 0
      });

 return(
    <div className='blueprints'>
      <ButtonBar />
      <div className=''>
        <table className="table table-hover">
          <tbody>
            <tr className={emptyClassSet}>
              <td colSpan="6" className='text-center'>
                No blueprints found.
              </td>
            </tr>          
            {blueprints}
          </tbody>
        </table>
      </div>
    </div>    
  )}
});
 
module.exports = BlueprintsList;