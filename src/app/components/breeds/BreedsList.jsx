var React = require('react/addons');
var _ = require('underscore');
var classNames = require('classnames');
var ToolBar = require('../ToolBar.jsx');
var BreedListItem = require('./BreedListItem.jsx');
var LoadStates = require("../../constants/LoadStates.js");
var BreadCrumbsBar = require('../BreadCrumbsBar.jsx');
var TransitionGroup = React.addons.CSSTransitionGroup;

var BreedsList = React.createClass({

  getInitialState: function() {
    return {
      filterText: '',
      viewType:'general-list'
    };
  },
  
  handleAdd: function() {
    console.log('handle add')
  },
  handleUserInput: function(filterText) {
    this.setState({
      filterText: filterText,
    });
  },
  handleViewSwitch: function(viewType) {
    this.setState({
      viewType: viewType,
    });
  },

  render: function() {

    var loadingClassSet = classNames({
      "hidden": this.props.loadState !== LoadStates.STATE_LOADING
    });

    var allBreeds = this.props.allBreeds;
    var breeds = [];

    _.each(allBreeds, function(breed,key) {
      var filterTerm = this.state.filterText.toLowerCase() || false;
      if ( ( breed.name.toLowerCase().indexOf(filterTerm) === -1 && breed.deployable.toLowerCase().indexOf(filterTerm) === -1 && filterTerm) ) {
        return;
      }
      breeds.push(<BreedListItem key={key} breed={breed} />);
    }, this);

    var emptyClassSet = classNames({
      "empty-list": true,
      "hidden": breeds.length > 0
    });
    var listHeaderClasses = classNames({
      "list-header": true,
      "hidden": breeds.length <= 0
    });

    return(
      <div className='list-container'>
        <ToolBar 
          filterText={this.state.filterText}
          onUserInput={this.handleUserInput}
          handleViewSwitch={this.handleViewSwitch} />
        <span className={emptyClassSet}>No breeds found.</span>
        <TransitionGroup component="ul" transitionName="fadeIn" transitionAppear={true} className={this.state.viewType}>
          <li className={listHeaderClasses}>
            <div className="list-section section-half">
              <h4>Breed</h4>
            </div>
            <div className="list-section section-sixth">
              <h4>Ports</h4>
            </div>
            <div className="list-section section-sixth">
              <h4>Dependencies</h4>
            </div>
            <div className="list-section section-sixth">
              <h4>Constants</h4>
            </div>
          </li>
          {breeds}
        </TransitionGroup>
      </div>
    )
  }
});
 
module.exports = BreedsList;