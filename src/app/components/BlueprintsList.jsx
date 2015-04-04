var React = require('react/addons');
var BlueprintListItem = require('./BlueprintListItem.jsx');
var LoadStates = require("../constants/LoadStates.js");

var BlueprintsList = React.createClass({
  render: function() {

      var loadingClassSet = React.addons.classSet({
        "hidden": this.props.loadState !== LoadStates.STATE_LOADING
      });

      var allBlueprints = this.props.allBlueprints;
      console.log(allBlueprints)
      var blueprints = [];

      for (var key in allBlueprints) {
        blueprints.push(<BlueprintListItem key={key} blueprint={allBlueprints[key]} />);
      }

    return(
      <div>
        <div className={loadingClassSet}>
          <h4 className="text-center muted">
            Loading...
          </h4>
        </div>
        <div className="">
          <div className="">
            <ul className="blueprints-list">
            {blueprints}
            </ul>
          </div>
        </div>
      </div>  
  )}
});
 
module.exports = BlueprintsList;