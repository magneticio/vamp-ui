var React = require('react');
var Link = require('react-router').Link
var BlueprintListItem = React.createClass({
  render: function() {

    var blueprint = this.props.blueprint;
    return (
      <li className="blueprints-list-item">
        <h3 className="blueprints-list-name">
          <Link to="blueprint" params={{id: blueprint.name}}>{blueprint.name}</Link>
        </h3>
      </li>
  )}
});
 
module.exports = BlueprintListItem;