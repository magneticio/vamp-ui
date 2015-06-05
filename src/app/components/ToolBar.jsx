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
  handleSubmit: function(e){
    e.preventDefault();
  },
  handleClick: function(viewType){
    this.props.handleViewSwitch(viewType);
  },

  render: function() {

    return (
      <section id="toolbar" className="toolbar">
        <button className="view-switch" onClick={this.handleClick.bind(this,'general-list')}><img src="/images/unordered-list.svg" alt="list icon" width="20px" height="20px" /></button>
        <button className="view-switch" onClick={this.handleClick.bind(this,'card-list')}><img src="/images/grid-large.svg" alt="card icon" width="20px" height="20px" /></button>
        <form className="search-form" onSubmit={this.handleSubmit}>
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
      </section>
  )}
});
 
module.exports = ToolBar;