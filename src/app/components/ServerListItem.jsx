var React = require('react');
var _ = require('underscore')
var ServerListItem = React.createClass({

  propTypes: {
    server: React.PropTypes.object,
  },


  render: function() {

    var server = this.props.server;

    return (
      <tr className='server-list-item'>
        <td className='clip-names'>{server.name}</td>
        <td>{server.host}</td>
        <td>{_.values(server.ports) + " <- " + _.keys(server.ports)}</td>
      </tr>
  )}
});
 
module.exports = ServerListItem;