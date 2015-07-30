var React = require('react');
var FilterItem = require('./FilterItem.jsx');
var _ = require('underscore');

var FilterList = React.createClass({

  propTypes: {
    filters: React.PropTypes.array,
  },

  getInitialState: function(){
    return {
      allFilters: '',
      editState: false
    }
  },
  componentDidMount: function(){
    this.setState({ allFilters: this.props.filters });
  },
  componentWillReceiveProps: function(nextProps){
    if(!this.state.editState)
    this.setState({ allFilters: nextProps.filters });
  },

  updateFilters: function(newValue, oldValue){
    var filtersArray = [];

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
      </ul> 
  )}
});
 
module.exports = FilterList;