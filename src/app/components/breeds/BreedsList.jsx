var React = require('react/addons');
var _ = require('underscore');
var ToolBar = require('../ToolBar.jsx');
var BreedListItem = require('./BreedListItem.jsx');
var LoadStates = require("../../constants/LoadStates.js");
var BreedsList = React.createClass({

  handleAdd: function() {
    console.log('handle add')
  },

  getInitialState: function() {
    return {
      filterText: '',
    };
  },

  handleUserInput: function(filterText) {
    this.setState({
      filterText: filterText,
    });
  },

  render: function() {

    var loadingClassSet = React.addons.classSet({
      "hidden": this.props.loadState !== LoadStates.STATE_LOADING
    });

    var allBreeds = this.props.allBreeds;
    var breeds = [];

    _.each(allBreeds, function(val,key) {
      console.log(this.state.filterText);
      if (val.name.indexOf(this.state.filterText) === -1 && this.state.filterText !== '' && typeof this.state.filterText !== 'undefined') {
        return;
      }
      breeds.push(<BreedListItem key={val.name} breed={val} />);
    }, this);

    var emptyClassSet = React.addons.classSet({
      "hidden": breeds.length > 0
    });      

    return(
      <div className='list-container'>
      <ToolBar 
        filterText={this.state.filterText}
        onUserInput={this.handleUserInput} />
      <span className={emptyClassSet}>No breeds found.</span>
      <ul className='general-list'>
        {breeds}
      </ul>
      </div>  
    )
  }
});
 
module.exports = BreedsList;