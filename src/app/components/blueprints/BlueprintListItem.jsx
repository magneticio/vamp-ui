var React = require('react');
var Loader = require('../Loader.jsx')
var BlueprintActions = require('../../actions/BlueprintActions.js')
var BlueprintListItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  handleDetail: function () {
    this.context.router.transitionTo('blueprint',{id: this.props.blueprint.name})
  },

  handleDeploy: function() {
    console.log('clicked deploy')
    BlueprintActions.deployBlueprint(this.props.blueprint)
    this.context.router.transitionTo('deployments')
  },

  handleEdit: function() {
  },

  handleDelete: function() {
    BlueprintActions.deleteBlueprint(this.props.blueprint)
  },

  render: function() {

    var blueprint = this.props.blueprint;
    var randomkey = Math.floor( Math.random() * 1000 );

    return (
      <li className="list-item">
        <span className={ (blueprint.status == 'CLEAN' ? 'hidden' : '') }>
          <Loader />
        </span>
        <div className="list-section section-half">
          <a onClick={this.handleDetail}><p className="item-name">{blueprint.name}</p></a>
        </div>
        <div className="list-section section-half list-controls">
          <button className='button button-green' onClick={this.handleDeploy}>Deploy</button>
          <button className='button button-yellow' onClick={this.handleEdit}>Edit</button>
          <button className='button button-red' onClick={this.handleDelete}>Delete</button>
        </div>
      </li>
  )}
});
 
module.exports = BlueprintListItem;