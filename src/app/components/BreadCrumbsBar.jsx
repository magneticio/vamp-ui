var React = require('react');
var BreadCrumbsBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  render: function() {
    
    var params = this.context.router.getCurrentParams()
    var str = this.context.router.getCurrentPathname()
    var normalizedPath = str.substring(0,(str.slice(1).indexOf('\/'))+1)

    return (
      <ul className="breadcrumb">
        <li><a href={ "#" + normalizedPath}>{normalizedPath}</a></li>
        <li className='active'>{params}</li>
      </ul>
  )}
});
 
module.exports = BreadCrumbsBar;
