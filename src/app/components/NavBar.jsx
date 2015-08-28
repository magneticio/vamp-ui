var React = require('react/addons');
var classNames = require('classnames');
var _ = require('underscore');

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

    var errorsToBeShown = _.isEmpty(this.props.errors) ? false : true,
        errorMessage = errorsToBeShown && 'INTERNAL' in this.props.errors ? this.props.errors['INTERNAL'].message : '';

    var tabs = this.props.tabs.map(function (tab) {
      var path = this.context.router.getCurrentPathname(),
          params = this.context.router.getCurrentParams().id,
          isActive = (path == tab.id),
          className = isActive ? 'active' : '';
      
      if (params) 
        path = path.substring(0,(path.slice(1).indexOf('\/'))+1);

      return (
        <li key={tab.id} className="navigation-item"><a href={"#" + tab.id} id={tab.text + "-link"} className={className}>{tab.text}</a></li>
      );
    }, this);

    var optionsIconClasses = classNames({
      "badge": errorsToBeShown,
      "error-badge": errorsToBeShown,
      "navigation-options": true
    });

    return (
      <nav className="main-navigation" role="navigation">
        <div className="branding">
          <a className="logo animated fadeInLeft" href="/#deployments">
            <img src='/images/vamp_logo_blue.svg' alt="VAMP logo" />
            <span className="alpha">alpha</span>
          </a>
        </div>

        <ul className="navigation-list">
          {tabs}
        </ul>

        <div className={optionsIconClasses}>
          <img src='/images/cog-thick.svg' alt="Options icon" width='20px' height='20px' onClick={this.props.togglePageContent}/>
        </div>
      </nav>
    );
  }
});

module.exports = NavBar;