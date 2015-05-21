var React = require('react');
var BreedActions = require('../../actions/BreedActions');
var BreedStore = require('../../stores/BreedStore');
var BreadCrumbsBar = require('../BreadCrumbsBar.jsx');

var BreedDetail = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      breed: []
    }
  },

  componentDidMount: function() {
    var name = this.context.router.getCurrentParams().id
    this.setState(
      { 
        breed: BreedStore.getBreed(name)
      }
    )
  },



  render: function() {
    return(
      <div className='col-md-12 breeds'>
        <BreadCrumbsBar/>
        <pre>
          <code>
          {JSON.stringify(this.state.breed,null,2)}
          </code>
        </pre>  
      </div>
  )}
});
 
module.exports = BreedDetail;