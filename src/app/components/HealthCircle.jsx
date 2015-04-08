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
      green : '#4AE40B',
      orange : '#FFAB40',
      red : '#DD2C00'
    }
    
    var color = ''

    if (this.props.seed) {
      color = this.stringToColour(this.props.seed)
    } else {
      color = stateColors[this.props.state]
    }

    var swatchStyle = {
        background: color,
        width: '1.2em',
        height: '1.2em',
        borderRadius: '50%',
        display: 'inline-block',
        verticalAlign: 'middle',
        textIndent: '-1000px',
        overflow: 'hidden',
    }

    return(

      <div style={swatchStyle}></div>
  )}
});
 
module.exports = HealthCircle;
