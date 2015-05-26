var React = require('react');
var ToolBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },
  handleChange: function() {
    this.props.onUserInput(
        this.refs.filterTextInput.getDOMNode().value
    );
  },
  render: function() {

    return (
      <section id="toolbar" className="toolbar">
        <form className="filter-form">
          <label htmlFor="searchfield">
            <img src="/images/search.svg" alt="search icon" width="16px" height="16px" className="search-icon" />
            <input id="searchfield" 
              type="search" 
              placeholder="Search" 
              name="searchfield" 
              value={this.props.filterText}
              ref="filterTextInput"
              onChange={this.handleChange} />
          </label>
        </form>
        <div className="toggle-view-switch">
          view-icons
        </div>
      </section>
  )}
});
 
module.exports = ToolBar;