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

    var randomKey = Math.random();

    return(
      <ul className='filters-list'>
        {filters}
        <li key={randomKey}><a className="add-link">+ Add Filter</a></li>
      </ul> 
  )}
});
 
module.exports = FilterList;