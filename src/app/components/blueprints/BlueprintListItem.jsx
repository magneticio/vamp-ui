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
    
    return (
      <tr>
        <td>
          <span className={ (blueprint.status == 'CLEAN' ? 'hidden' : '') }>
            <Loader />
          </span>            
          <a className='artifact-name clip-names' onClick={this.handleDetail}>{blueprint.name}</a>       
        </td>
        <td>
        </td>
        <td>
        </td>
        <td>
          <div className='inline-button-bar'>
            <button className='btn btn-info' onClick={this.handleDeploy}>Deploy</button>
            <button className='btn btn-success' onClick={this.handleEdit}>Edit</button>
            <button className='btn btn-danger' onClick={this.handleDelete}>Delete</button>
          </div>
        </td>
      </tr>
  )}
});
 
module.exports = BlueprintListItem;