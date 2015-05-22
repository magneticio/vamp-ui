var React = require('react');
var Loader = require('../Loader.jsx')
var BreedActions = require('../../actions/BreedActions.js')
var _ = require('underscore');
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
    var ports = [];
    _.each(this.props.breed.ports, function(val,key){
      ports.push(<div className='badge'><span className='badge-key'>{key}</span>{val}</div>);
    });

    return (
      <li className="card" onClick={this.handleDetail}>
        <span className={ (breed.status == 'CLEAN' ? 'hidden' : '') }>
          <Loader />
        </span>
        <div className='artifact-name clip-names'>
          <p className="card-name">{breed.name}</p>
          <p className="card-deployable">{breed.deployable}</p>
        </div>
        <div className="card-ports">
          <span className="ports-label">Ports</span>
          {ports}
        </div>
        <ul className="card-meta-list">
          <li className="card-meta">
            <span className="card-meta-title">Constants </span>
            {constants}
          </li>
          <li className="card-meta">
            <span className="card-meta-title">Dependencies </span>
            {dependencies}
          </li>
          <li className="card-meta">
            <span className="card-meta-title">Env. Variables </span>
            {envVariables}
          </li>
        </ul>
      </li>
  )}
});
 
module.exports = BreedListItem;