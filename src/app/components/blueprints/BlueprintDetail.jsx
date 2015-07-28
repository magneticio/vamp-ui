var React = require('react');
var TransitionGroup = React.addons.CSSTransitionGroup;
var _ = require('underscore');
var classNames = require('classnames');
var LoadStates = require("../../constants/LoadStates.js");
var BlueprintActions = require('../../actions/BlueprintActions');
var BlueprintStore = require('../../stores/BlueprintStore');
var BreadCrumbsBar = require('../BreadCrumbsBar.jsx');

var BlueprintDetail = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      blueprint: {}
    }
  },
  getInitialState: function() {
    return {
      loadState: LoadStates.STATE_LOADING,
      currentBlueprint: {},
      blueprintDirty: ''
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
    if(_.isEmpty(this.state.currentBlueprint)){
      var currentBlueprint = BlueprintStore.getBlueprint(this.state.name);

      if(currentBlueprint && 'status' in currentBlueprint)
        delete currentBlueprint.status;
      
      this.setState({
        blueprintDirty: JSON.stringify(currentBlueprint,null,2),
        currentBlueprint: currentBlueprint
      });
    }
  },
  handleChange: function(e) {
    console.log('handleChange');
    this.setState({ 
      blueprintDirty: e.target.value
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
      <TransitionGroup id='blueprints-single' component="div" transitionName="fadeIn" transitionAppear={true} transitionLeave={true} >
        <BreadCrumbsBar/>
        <span className={errorMessageClassSet}>{errorMessage}</span>        
        <div className={containerClassnames}>
          <section className="half-width-section preview">
            <pre>
              <code>
                {this.state.blueprintDirty}
              </code>
            </pre>
          </section>
          <section className="half-width-section editview hidden">
            <textarea value={this.state.blueprintDirty} onChange={this.handleChange} rows="16"/>
          </section>
        </div>
      </TransitionGroup>
  )}
});
 
module.exports = BlueprintDetail;