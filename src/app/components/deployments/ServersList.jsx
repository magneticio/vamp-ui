var React = require('react');
var ServerListItem = require('./ServerListItem.jsx')
var ServersList = React.createClass({

  propTypes: {
    servers: React.PropTypes.array,
  },

  render: function() {

    var servers = []
  
    for (var key in this.props.servers) {
        servers.push(<ServerListItem key={key} server={this.props.servers[key]}/>);
    }

    return (
      <table className='servers-list table table-striped'>
        <thead>
          <tr>
            <th>name</th>  
            <th>host</th>  
            <th>port map</th>  
          </tr>
        </thead>
        <tbody>
        {servers}        
        </tbody>
      </table>
  )}
});
 
module.exports = ServersList;