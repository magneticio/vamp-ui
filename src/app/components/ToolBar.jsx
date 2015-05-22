var React = require('react');
var ToolBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  render: function() {

    return (
      <section id="toolbar" className="toolbar">
        <form className="filter-form">
          <input type="search" placeholder="Search" />
        </form>
        <div className="toggle-view-switch">
          view-icons
        </div>
      </section>
  )}
});
 
module.exports = ToolBar;
