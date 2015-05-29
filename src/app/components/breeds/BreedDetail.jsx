var _ = require('underscore');
var React = require('react');
var BreedActions = require('../../actions/BreedActions');
var BreedStore = require('../../stores/BreedStore');
var BreadCrumbsBar = require('../BreadCrumbsBar.jsx');
var LoadStates = require("../../constants/LoadStates.js");

var BreedDetail = React.createClass({

  name: '',

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      loadState: LoadStates.STATE_LOADING,
      currentBreed: {},
      breedDirty: ''
    };
  },
  componentDidMount: function() {
    this.name = this.context.router.getCurrentParams().id;
    this.setStatesWhenAvailable();
  },
  componentWillReceiveProps: function(nextProps) {
    this.setStatesWhenAvailable();
  },
  setStatesWhenAvailable: function(props){
    if(_.isEmpty(this.state.currentBreed)){
      var currentBreed = BreedStore.getBreed(this.name);
      this.setState({
        breedDirty: JSON.stringify(currentBreed,null,2),
        currentBreed: currentBreed
      });
    }
  },
  handleChange: function(e) {
    console.log('handleChange');
    this.setState({ 
      breedDirty: e.target.value
    });
  },

  render: function() {
    return(
      <div>
        <BreadCrumbsBar/>
        <div className='single-view'>
          <section className="single-half preview">
            <pre>
              <code>
                {this.state.breedDirty}
              </code>
            </pre>
          </section>
          <section className="single-half editview">
            <textarea value={this.state.breedDirty} onChange={this.handleChange} rows="16"/>
          </section>
        </div>
      </div>
  )},

});
 
module.exports = BreedDetail;