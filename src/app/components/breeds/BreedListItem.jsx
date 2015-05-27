var React = require('react');
var _ = require('underscore');
var Loader = require('../Loader.jsx');
var Badge = require('../Badge.jsx');
var BreedActions = require('../../actions/BreedActions.js');

var BreedListItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  handleDetail: function (){
    this.context.router.transitionTo('breed',{id: this.props.breed.name});
  },  

  handleDelete: function(){
    BreedActions.deleteBreed(this.props.breed);
  },

  render: function() {

    var breed = this.props.breed;
    
    var constants = _.size(breed.constants);
    var dependencies = _.size(breed.dependencies);
    var envVariables = _.size(breed.environment_variables);
    var portCount = _.size(breed.ports);
    var ports = [];
    _.each(this.props.breed.ports, function(val,key){
      ports.push(<Badge key={key} label={key} port={val} />);
    });

    return (
      <li className="list-item" onClick={this.handleDetail}>
        <span className={ (breed.status == 'CLEAN' ? 'hidden' : '') }>
          <Loader />
        </span>
        <p className="item-name">{breed.name}</p>
        <p className="item-deployable">{breed.deployable}</p>
        <div className="item-ports">
          {ports}
        </div>
        <ul className="item-meta-list">
          <li className="item-meta">
            <span className="item-meta-title">Ports </span>
            {portCount}
          </li>
          <li className="item-meta">
            <span className="item-meta-title">Constants </span>
            {constants}
          </li>
          <li className="item-meta">
            <span className="item-meta-title">Dependencies </span>
            {dependencies}
          </li>
          <li className="item-meta">
            <span className="item-meta-title">Env. Variables </span>
            {envVariables}
          </li>
        </ul>
      </li>
  )}
});
 
module.exports = BreedListItem;