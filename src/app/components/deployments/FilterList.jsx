var React = require('react');
var FilterItem = require('./FilterItem.jsx');
var _ = require('underscore');

var FilterList = React.createClass({

  propTypes: {
    filters: React.PropTypes.array,
  },

  getInitialState: function(){
    return {
      allFilters: ''
    }
  },

  componentDidMount: function(){
    this.setState({
      allFilters: this.props.filters
    });
  },

  updateFilters: function(newValue, oldValue){
    var filtersArray = [];
    var dropKey = '';

    _.each(this.state.allFilters, function(value, key){
      if (value['condition'] == oldValue && newValue == ''){
        console.log('emtpy');
      } else if (value['condition'] == oldValue && newValue !== ''){
        filtersArray[key] = { condition: newValue };
      } else {
        filtersArray.push(value);
      }
    }, this);

    this.setState({
      allFilters: filtersArray
    });
    
    this.props.updateServiceFilters(filtersArray);
  },

  addFilter: function(e){
    e.preventDefault();
    console.log('onclick');
    
    var emptyFilter = {'condition': ''};
    var currentFilters = [];
    _.each(this.state.allFilters, function(value, key){
      currentFilters.push(value);  
    });
    
    currentFilters.push(emptyFilter);
    this.setState({
      allFilters: currentFilters
    });
  },

  render: function() {

    var filters = [],
        addFilter = [];

    _.each(this.state.allFilters, function(value, key) {
      filters.push(<FilterItem key={key} filter={value} updateFilters={this.updateFilters} />);
    }, this);

    var randomKey = Math.floor( Math.random() * 10 );

    return(
      <ul className='filters-list'>
        {filters}
        <li key={randomKey}><a className="add-link" onClick={this.addFilter}>+ Add Filter</a></li>
      </ul> 
  )}
});
 
module.exports = FilterList;