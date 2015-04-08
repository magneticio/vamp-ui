var React = require('react');
var BlueprintActions = require('../actions/BlueprintActions');
var BlueprintStore = require('../stores/BlueprintStore');
var BreadCrumbsBar = require('./BreadCrumbsBar.jsx');

var BlueprintDetail = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      blueprint: {}
    }
  },

  componentDidMount: function() {
    var name = this.context.router.getCurrentParams().id
    this.setState(
      { 
        blueprint: BlueprintStore.getBlueprint(name)
      }
    )
  },
  render: function() {
    return(
      <div className='col-md-12 blueprints'>
        <BreadCrumbsBar/>
        <pre>
          <code>
          {JSON.stringify(this.state.blueprint,null,2)}
          </code>
        </pre>  
      </div>
  )}
});
 
module.exports = BlueprintDetail;