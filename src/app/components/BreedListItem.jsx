var React = require('react');
var Link = require('react-router').Link
var BreedListItem = React.createClass({
  render: function() {

    var breed = this.props.breed;
    return (
      <li className="breeds-list-item">
        <h3 className="breeds-list-name">
          <Link to="breed" params={{id: breed.name}}>{breed.name}</Link>
        </h3>
      </li>
  )}
});
 
module.exports = BreedListItem;