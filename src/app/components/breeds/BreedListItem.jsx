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
      ports.push(<Badge key={key} label={key} valueName={val} />);
    });

    return (
      <li className="list-item" onClick={this.handleDetail}>
        <span className={ (breed.status == 'CLEAN' ? 'hidden' : '') }>
          <Loader />
        </span>
        <div className='list-section section-half'>
          <p><a>{breed.name}</a></p><br/>
          <p className="small-caps">{breed.deployable}</p>
        </div>
        <div className="list-section section-sixth">
          {portCount}
        </div>
        <div className="list-section section-sixth">
          {dependencies}
        </div>
        <div className="list-section section-sixth">
          {constants}
        </div>
      </li>
  )}
});
 
module.exports = BreedListItem;