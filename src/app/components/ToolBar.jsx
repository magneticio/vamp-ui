var React = require('react');
var ToolBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  render: function() {

    return (
      <section id="toolbar" className="toolbar">
        <form className="filter-form">
          <label for="searchfield">
            <img src="/images/search.svg" alt="search icon" width="16px" height="16px" className="search-icon" />
            <input type="search" placeholder="Search" name="searchfield" />
          </label>
        </form>
        <div className="toggle-view-switch">
          view-icons
        </div>
      </section>
  )}
});
 
module.exports = ToolBar;