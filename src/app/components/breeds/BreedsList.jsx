var React = require('react/addons');
var ToolBar = require('../ToolBar.jsx');
var BreedListItem = require('./BreedListItem.jsx');
var LoadStates = require("../../constants/LoadStates.js");
var BreedsList = React.createClass({

  handleAdd: function() {
    console.log('handle add')
  },

  render: function() {

    var loadingClassSet = React.addons.classSet({
      "hidden": this.props.loadState !== LoadStates.STATE_LOADING
    });

    var allBreeds = this.props.allBreeds;
    var breeds = [];

    for (var key in allBreeds) {
      breeds.push(<BreedListItem key={key} breed={allBreeds[key]} />);
    }

    var emptyClassSet = React.addons.classSet({
      "hidden": breeds.length > 0
    });      

    return(
      <div className='list-container'>
      <ToolBar />
        <span className={emptyClassSet}>No breeds found.</span>
        <ul className='breeds-list card-list'>
          {breeds}
        </ul>
      </div>  
    )
  }
});
 
module.exports = BreedsList;