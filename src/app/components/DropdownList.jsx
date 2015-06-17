var React = require('react');
var _ = require('underscore');

var DropdownList = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function(){
    return {
      expanded: false
    }
  },

  render: function() {

    var listSize = _.size(this.props.items);
    var message = '';
    var itemList = [];

    if(listSize == 0){
      message = <span className="muted">-</span>;
    } else {
      message = this.props.items[0];
    }

    if(listSize > 1) {
      _.each(this.props.items, function(val, key){
        if(key == 0)
          itemList.push(<li key={key} className='first-item'>{listSize-1} more <span className='icon-dropdown'>&#x25BC;</span></li>);
        else
          itemList.push(<li key={key}>{val}</li>);
      });
    }

    return (
      <div className='dropdown-list-container'>
        <p className='dropdown-list-message'>{message}</p>
        <ul className='dropdown-list'>
          {itemList}
        </ul>
      </div>
  )}
});
 
module.exports = DropdownList;