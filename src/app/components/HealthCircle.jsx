var React = require('react');
var HealthCircle = React.createClass({

  propTypes: {
    state: React.PropTypes.string,
    seed: React.PropTypes.string
  },

  stringToColour: function(str) {

      // str to hash
      for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
      // int/hash to hex
      for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));
      return colour;
  },
          


  render: function() {

    var stateColors = {
      green : '#2ECC71',
      orange : '#FFEB3B',
      red : '#E54D42'
    }
    
    var color = ''

    if (this.props.seed) {
      color = this.stringToColour(this.props.seed)
    } else {
      color = stateColors[this.props.state]
    }

    var swatchStyle = {
        background: color,
    }

    return(

      <div style={swatchStyle} className='health-circle'></div>
  )}
});
 
module.exports = HealthCircle;
