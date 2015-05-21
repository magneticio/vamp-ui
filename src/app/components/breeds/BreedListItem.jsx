var React = require('react');
var Loader = require('../Loader.jsx')
var BreedActions = require('../../actions/BreedActions.js')
var BreedListItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  handleDetail: function () {
    this.context.router.transitionTo('breed',{id: this.props.breed.name})
  },  

  handleDelete: function() {
    BreedActions.deleteBreed(this.props.breed)
  },

  render: function() {

    var breed = this.props.breed;
    return (
      <li className="card">
        <span className={ (breed.status == 'CLEAN' ? 'hidden' : '') }>
          <Loader />
        </span>
        <a className='artifact-name clip-names' onClick={this.handleDetail}>{breed.name}</a>
        <div className='button-bar'>
          <button className='btn btn-danger' onClick={this.handleDelete}>Delete</button>
        </div>
      </li>
  )}
});
 
module.exports = BreedListItem;