var React = require('react/addons');
var BreedListItem = require('./BreedListItem.jsx');
var LoadStates = require("../constants/LoadStates.js");
var BreedsList = React.createClass({
  render: function() {

      var loadingClassSet = React.addons.classSet({
        "hidden": this.props.loadState !== LoadStates.STATE_LOADING
      });

      var allBreeds = this.props.allBreeds;
      var breeds = [];

      for (var key in allBreeds) {
        breeds.push(<BreedListItem key={key} breed={allBreeds[key]} />);
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
            <ul className="breeds-list">
            {breeds}
            </ul>
          </div>
        </div>
      </div>  
  )}
});
 
module.exports = BreedsList;