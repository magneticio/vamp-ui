var React = require('react/addons');
var Config = require('../config.js');
var AppActions = require('../actions/AppActions');
var _ = require('underscore');
var classNames = require('classnames');

var OptionsPaneSection = React.createClass({

  render: function(){
    var listItems = [];

    _.each(this.props.listItems, function(value, key){
      listItems.push(<dt key={key+value}>{key}</dt>);
      listItems.push(<dd key={value+key}>{value}</dd>);
    }, this);
  
  	return (
  		<section className="options-pane-section">
          <h4>{this.props.sectionTitle}</h4>
          <dl>
            {listItems}
          </dl>
      </section>
  	);
  }

});

module.exports = OptionsPaneSection;