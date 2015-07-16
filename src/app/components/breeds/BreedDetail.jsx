var React = require('react');
var TransitionGroup = React.addons.CSSTransitionGroup;
var _ = require('underscore');
var classNames = require('classnames');
var BreedActions = require('../../actions/BreedActions');
var BreedStore = require('../../stores/BreedStore');
var BreadCrumbsBar = require('../BreadCrumbsBar.jsx');
var LoadStates = require("../../constants/LoadStates.js");

var BreedDetail = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      name: '',
      loadState: LoadStates.STATE_LOADING,
      currentBreed: {},
      breedDirty: ''
    };
  },
  componentDidMount: function() {
    this.state.name = this.context.router.getCurrentParams().id;
    this.setStatesWhenAvailable();
  },
  componentWillReceiveProps: function(nextProps) {
    this.setStatesWhenAvailable();
  },
  setStatesWhenAvailable: function(props){
    if(_.isEmpty(this.state.currentBreed)){
      var currentBreed = BreedStore.getBreed(this.state.name);
      
      if(currentBreed && 'status' in currentBreed)
        delete currentBreed.status;

      this.setState({
        breedDirty: JSON.stringify(currentBreed,null,2),
        currentBreed: currentBreed
      });
    }
  },
  handleChange: function(e) {
    console.log('handleChange');
    this.setState({ 
      breedDirty: e.target.value
    });
  },

  render: function() {

    var errorsToBeShown = this.props.errors['UNREACHABLE'] ? true : false,
        errorMessage = errorsToBeShown ? this.props.errors['UNREACHABLE'].message : '';

    var containerClassnames = classNames({
      'dimmed': errorsToBeShown,
      'section-full': true
    });
    var errorMessageClassSet = classNames({
      "error-status-message": true,
      "container-status-message": true,
      "hidden": !errorsToBeShown
    });

    return(
      <TransitionGroup id='breed-single' className='single' component="div" transitionName="fadeIn" transitionAppear={true} transitionLeave={true} >
        <BreadCrumbsBar/>
        <span className={errorMessageClassSet}>{errorMessage}</span>        
        <div className={containerClassnames}>
          <section className="half-width-section preview">
            <pre>
              <code>
                {this.state.breedDirty}
              </code>
            </pre>
          </section>
          <section className="half-width-section editview hidden">
            <textarea value={this.state.breedDirty} onChange={this.handleChange} rows="16"/>
          </section>
        </div>
      </TransitionGroup>
  )},

});
 
module.exports = BreedDetail;