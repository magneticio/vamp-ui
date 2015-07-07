var React = require('react/addons');
var Config = require('../config.js');
var AppActions = require('../actions/AppActions');
var _ = require('underscore');
var classNames = require('classnames');

var OptionsPaneSection = React.createClass({

  render: function(){

    var listItems = [],
        errorsToBeShown = this.props.errors['UNREACHABLE'] ? true : false,
        errorMessage = errorsToBeShown ? this.props.errors['UNREACHABLE'].message : '';

    _.each(this.props.listItems, function(value, key){
      var warningClass = classNames({ 'warning': key == 'error' ? true : false });
      listItems.push(<dt key={key+value} className={warningClass}>{key}</dt>);
      listItems.push(<dd key={value+key} className={warningClass}>{value}</dd>);
    }, this);

    // Setup dynamic classes
    var sectionClasses = classNames({
      'hidden': errorsToBeShown,
      'options-pane-section': true
    });

  	return (
  		<section className={sectionClasses}>
          <h4>{this.props.sectionTitle}</h4>
          <dl>
            {listItems}
          </dl>
      </section>
  	);
  }

});

module.exports = OptionsPaneSection;