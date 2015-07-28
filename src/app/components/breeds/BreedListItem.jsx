var React = require('react');
var _ = require('underscore');
var Loader = require('../Loader.jsx');
var BreedActions = require('../../actions/BreedActions.js');
var BreedStore = require('../../stores/BreedStore.js');
var DropdownList = require('../DropdownList.jsx');

var BreedListItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },
  
  getInitialState: function(){
    return {
      deleteRequestPending: false,
    }
  },
  handleDetail: function (e){
    e.preventDefault();
    this.props.handleDetail(this.props.breed.name)
  },  
  handleDelete: function(){
    BreedActions.deleteBreed(this.props.breed);
  },

  prepareMetaInformation: function(metaInformation){
    var itemList = [];
    _.each(metaInformation, function(val,key){
      itemList.push(val);
    });
    return itemList;
  },

  render: function() {

    var breed = this.props.breed,
        constants = this.prepareMetaInformation(breed.constants),
        dependencies = this.prepareMetaInformation(breed.dependencies),
        envVariables = this.prepareMetaInformation(breed.envVariables),
        ports = this.prepareMetaInformation(breed.ports);

    return (
      <li className="list-item">
        <div className='list-section section-half'>
          <span className={ (breed.status == 'CLEAN' ? 'hidden' : '') }>
            <Loader />
          </span>
          <p><a onClick={this.handleDetail} className="editable">{breed.name}</a></p><br/>
          <p className="small-caps">{breed.deployable}</p>
        </div>
        <div className="list-section section-sixth">
          <DropdownList items={ports} />
        </div>
        <div className="list-section section-sixth">
          <DropdownList items={dependencies} />
        </div>
        <div className="list-section section-sixth">
          <DropdownList items={constants} />
        </div>
      </li>
  )}
});
 
module.exports = BreedListItem;