var React = require('react');
var FilterItem = require('./FilterItem.jsx');
var _ = require('underscore');

var FilterList = React.createClass({

  propTypes: {
    filters: React.PropTypes.array,
  },

  render: function() {

    var filters = [],
        addFilter = [];

    for (var key in this.props.filters) {
      filters.push(<FilterItem key={key} filter={this.props.filters[key]} />);
    }

    if(_.isEmpty(filters)){
      randomKey = Math.random();
      addFilter.push(<li key={randomKey} className="add-filter"><a>+ add filter</a></li>);
    }

    return(
      <ul className='filters-list'>
        {filters}
        {addFilter}
      </ul> 
  )}
});
 
module.exports = FilterList;