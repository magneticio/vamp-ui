var React = require('react');
var FilterItem = require('./FilterItem.jsx')
var FilterList = React.createClass({

  propTypes: {
    filters: React.PropTypes.array,
  },

  render: function() {

    filters=[]

    for (var key in this.props.filters) {
        filters.push(<FilterItem key={key} filter={this.props.filters[key]} />);
    }

    return(
     <div className='filters'> 
      <ul className='filters-list'>
        {filters}
      </ul>
     </div> 
  )}
});
 
module.exports = FilterList;