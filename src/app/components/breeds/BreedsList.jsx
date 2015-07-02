var React = require('react/addons');
var TransitionGroup = React.addons.CSSTransitionGroup;
var PureRenderMixin = React.addons.PureRenderMixin;
var SetIntervalMixin = require("../../mixins/SetIntervalMixin.js");
var _ = require('underscore');
var classNames = require('classnames');
var ToolBar = require('../ToolBar.jsx');
var LoadStates = require("../../constants/LoadStates.js");
var BreedListItem = require('./BreedListItem.jsx');
var BreadCrumbsBar = require('../BreadCrumbsBar.jsx');
var BreedActions = require('../../actions/BreedActions');

var BreedsList = React.createClass({
  
  mixins: [SetIntervalMixin],

  getInitialState: function() {
    return {
      filterText: '',
      viewType:'general-list',
      breedCount: 0,
      breedCreated: false,
    };
  },
  componentDidMount: function(){
    BreedActions.getAllBreeds();
    this.setInterval(this.pollBackend, 4000);
  },
  componentWillReceiveProps: function(nextProps){
    var nextBreedCount = _.size(nextProps.allBreeds);
    if(nextBreedCount > this.state.breedCount){
      this.setState({
        breedCount: nextBreedCount,
        breedCreated: true
      });
    } else if(nextBreedCount < this.state.breedCount){
      this.setState({
        breedCount: nextBreedCount,
        breedCreated: false
      });
    } else {
      this.setState({
        breedCreated: false
      });
    }
  },
  
  handleAdd: function(newBreed) {
    BreedActions.createBreed(newBreed);
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

    // Set vars
    var allBreeds = this.props.allBreeds,
        breeds = [],
        errorsToBeShown = this.props.errors['UNREACHABLE'] ? true : false,
        errorMessage = errorsToBeShown ? this.props.errors['UNREACHABLE'].message : '';
    
    // Prepare Breedslist
    _.each(allBreeds, function(breed,key) {
      var filterTerm = this.state.filterText.toLowerCase() || false;
      if ( ( breed.name.toLowerCase().indexOf(filterTerm) === -1 && breed.deployable.toLowerCase().indexOf(filterTerm) === -1 && filterTerm) ) {
        return;
      }
      breeds.push(<BreedListItem key={key} breed={breed} />);
    }, this);

    // Prepare dynamic classes
    var loadingClassSet = classNames({
      "hidden": this.props.loadState !== LoadStates.STATE_LOADING
    });
    var emptyClassSet = classNames({
      "empty-list": true,
      "container-status-message": true,
      "hidden": breeds.length > 0 || errorsToBeShown
    });
    var errorMessageClassSet = classNames({
      "error-status-message": true,
      "container-status-message": true,
      "hidden": !errorsToBeShown
    });
    var listHeaderClasses = classNames({
      "list-header": true,
      "hidden": breeds.length <= 0
    });
    var listClasses = classNames( this.state.viewType, {
      'dimmed': this.props.errors['UNREACHABLE']
    });

    return(
      <div className='list-container'>
        <ToolBar 
          filterText={this.state.filterText}
          onUserInput={this.handleUserInput}
          handleViewSwitch={this.handleViewSwitch}
          handleAdd={this.handleAdd}
          addArtefactType='breed'
          requestResolved={this.state.breedCreated} 
          loadState={this.props.loadState}/>
        <span className={emptyClassSet}>No running deployments.</span>
        <span className={errorMessageClassSet}>{errorMessage}</span>        
        <TransitionGroup 
          id='breeds-list'         
          component="ul" 
          transitionName="fadeIn" 
          transitionAppear={true}
          transitionLeave={true}
          className={listClasses}>
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
  )},
  
  pollBackend: function() {
    console.log('polling breeds');
    BreedActions.getAllBreeds();
  }
});
 
module.exports = BreedsList;