var React = require('react/addons');
var NavItem = require('react-bootstrap').NavItem;
var Nav = require('react-bootstrap').Nav
var NavBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },


  propTypes: {
    className: React.PropTypes.string,
    tabs: React.PropTypes.array.isRequired,
    activeTabId: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      className: ""
    };
  },

  render: function () {

    var cx = React.addons.classSet;

    var tabs = this.props.tabs.map(function (tab) {

    var path = this.context.router.getCurrentPathname() 
    var params = this.context.router.getCurrentParams().id
    
    if (params != undefined) {
          path = path.substring(0,(path.slice(1).indexOf('\/'))+1)
    }
    var isActive =  (path == tab.id)
    var className = isActive ? 'active' : '';

      return (
        <NavItem key={tab.id} className={className} href={"#" + tab.id}>{tab.text}</NavItem>
      );
    }, this);

    return (
      <nav className="navbar navbar-inverse navbar-static-top" role="navigation">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle">
            <span className="sr-only">Toggle navigation</span>
          </button>
          <a className="navbar-brand" href="/#deployments"><img className='logo' src='/images/vamp_logo_blue.svg'/></a>
          <span id="alpha">alpha</span>
        </div>

        <div className="collapse navbar-collapse" id="navbar-collapse-5">
          <ul className="nav navbar-nav">
            {tabs}
           </ul>
        </div>
      </nav>
    );
  }
});

module.exports = NavBar;