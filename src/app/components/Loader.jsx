var React = require('react');
var cx = require('classnames');

var Loader = React.createClass({
  render: function() {

  	var loaderClasses = cx('loader-container', this.props.hidden);

    return(
    	<div className={loaderClasses}>
      	<div className="loader-background"></div>
      	<div className="loader"></div>
      </div>
  )}
});
 
module.exports = Loader;