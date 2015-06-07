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
    
    _.each(this.state.allFilters, function(value, key){
      filtersArray[key] = value;
      if (value['condition'] == oldValue){
        filtersArray[key] = { condition: newValue };
      }
    }, this);

    this.props.updateServiceFilters(filtersArray);
    //return 'success';
  },

  componentWillReceiveProps: function(nextProps){
    //console.log('check');
  },

  render: function() {

    var filters = [],
        addFilter = [];

    for (var key in this.props.filters) {
      filters.push(<FilterItem key={key} filter={this.props.filters[key]} updateFilters={this.updateFilters} />);
    }

    var randomKey = Math.random();

    return(
      <ul className='filters-list'>
        {filters}
        <li key={randomKey}><a className="add-link">+ Add Filter</a></li>
      </ul> 
  )}
});
 
module.exports = FilterList;