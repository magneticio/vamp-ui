var React = require('react');
var BreadCrumbsBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  render: function() {
    
    var params = this.context.router.getCurrentParams();
    var str = this.context.router.getCurrentPathname();
    var normalizedPath = str.substring(1,(str.slice(1).indexOf('\/'))+1);

    return (
      <div className="breadcrumbs-bar toolbar">
        <ul className="breadcrumbs">
          <li><a href={ "#" + normalizedPath}>{normalizedPath}</a></li>
          <li className="icon-triangle"></li>
          <li className='active'>{React.addons.createFragment(params)}</li>
        </ul>
      </div>
  )}
});
 
module.exports = BreadCrumbsBar;
