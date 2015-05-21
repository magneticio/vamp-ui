var React = require('react');
var ToolBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  render: function() {

    return (
      <section id="toolbar" className="toolbar">
        <div className="toggle-view-switch">
          view-icons
        </div>
        <form className="filter-form">
          <input type="search" placeholder="Filter" />
          
        </form>
      </section>
  )}
});
 
module.exports = ToolBar;
