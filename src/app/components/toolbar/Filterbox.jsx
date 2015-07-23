var React = require('react');
var classNames = require('classnames');

var Filterbox = React.createClass({

  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.getDOMNode().value
    );
  },
  handleSubmit: function(e){
    e.preventDefault();
  },

  render: function() {

    return(
      <div className='filtering-tools-box'>
      
        <form className="search-form" onSubmit={this.handleSubmit}>
          <label htmlFor="searchfield">
            <img src="/images/search.svg" alt="search icon" width="16px" height="16px" className="search-icon" />
            <input id="searchfield" 
              type="search" 
              placeholder="Search" 
              name="searchfield" 
              ref="filterTextInput"
              onChange={this.handleChange} />
          </label>
        </form>
      </div>
  )}

});
 
module.exports = Filterbox;