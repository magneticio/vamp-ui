var React = require('react');
var _ = require('underscore');
var cx = require('classnames');
var Loader = require('../Loader.jsx')
var BlueprintActions = require('../../actions/BlueprintActions.js')
var BlueprintListItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  handleDetail: function(e) {
    e.preventDefault();
    this.context.router.transitionTo('blueprint',{id: this.props.blueprint.name});
  },
  handleDeploy: function(e) {
     var el = e.currentTarget,
        className = 'active',
        self = this;

    el.classList ? el.classList.add(className) : el.className += ' ' + className;
    BlueprintActions.deployBlueprint(this.props.blueprint);
    self.context.router.transitionTo('deployments');
  },
  handleDelete: function(e) {
    var el = e.currentTarget,
        className = 'active',
        self = this;

    el.classList ? el.classList.add(className) : el.className += ' ' + className;

    setTimeout(function(){
      BlueprintActions.deleteBlueprint(self.props.blueprint);
    }, 200);
  },

  render: function() {

    var blueprint = this.props.blueprint;
    var clusterCountTotal = _.keys(blueprint.clusters).length
    var servicesCountTotal = _.reduce(blueprint.clusters, function(memo,cluster){
        return memo + cluster.services.length
    },0);
    var randomkey = Math.floor( Math.random() * 1000 );
    var loaderClasses = cx({
      'hide': blueprint.status == 'CLEAN' ? true : false
    });

    return (
      <li className="list-item">
        <div className="list-section section-fifth">
          <a onClick={this.handleDetail}><p className="item-name">{blueprint.name}</p></a>
        </div>
        <div className="list-section section-fifth">
          9040
        </div>
        <div className="list-section section-fifth">
          {clusterCountTotal}
        </div>
        <div className="list-section section-fifth">
          Sava
        </div>
        <div className="list-section section-fifth list-controls">
          <button className='button button-ghost' onClick={this.handleDeploy}>Deploy</button>
          <button className='button button-red' onClick={this.handleDelete}>Delete</button>
        </div>
      </li>
  )}
});
 
module.exports = BlueprintListItem;