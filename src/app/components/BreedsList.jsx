var React = require('react/addons');
var BreedListItem = require('./BreedListItem.jsx');
var LoadStates = require("../constants/LoadStates.js");
var BreedsList = React.createClass({

  handleAdd: function() {
    console.log('handle add')
  },

  render: function() {

      var loadingClassSet = React.addons.classSet({
        "hidden": this.props.loadState !== LoadStates.STATE_LOADING
      });

      var allBreeds = this.props.allBreeds;
      var breeds = [];

      for (var key in allBreeds) {
        breeds.push(<BreedListItem key={key} breed={allBreeds[key]} />);
      }

      var emptyClassSet = React.addons.classSet({
        "hidden": breeds.length > 0
      });      

    return(
    <div className='breeds'>
      <div className=''>
        <table className="table table-hover">
          <tbody>
            <tr className={emptyClassSet}>
              <td colSpan="6" className='text-center'>
                No breeds found.
              </td>
            </tr>          
            {breeds}
          </tbody>
        </table>
      </div>
    </div>  
  )}
});
 
module.exports = BreedsList;