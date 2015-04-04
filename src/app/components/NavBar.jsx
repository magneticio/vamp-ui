var React = require('react/addons');
var NavItem = require('react-bootstrap').NavItem;
var Nav = require('react-bootstrap').Nav
var NavBar = React.createClass({

  propTypes: {
    activeTabId: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    tabs: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      className: ""
    };
  },

  render: function () {

    var cx = React.addons.classSet;
    var activeTabId = this.props.activeTabId;

    var tabs = this.props.tabs.map(function (tab) {
      var tabClassSet = cx({
        "active": tab.id === activeTabId
      });

      return (
        <NavItem key={tab.id} className={tabClassSet} href={"#" + tab.id}>{tab.text}</NavItem>
      );
    }, this);

    return (
      <nav className="navbar navbar-inverse navbar-static-top" role="navigation">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle">
            <span className="sr-only">Toggle navigation</span>
          </button>
          <a className="navbar-brand" href="#">Vamp</a>
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