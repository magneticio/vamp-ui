var React = require('react');
var cx = require('classnames');

var StatusIndicator = React.createClass({

	getInitialState: function(){
		return {
			status: 'waiting'
		};
	},

	componentWillMount: function(){
		var newStatus = 'waiting';

		switch(this.props.status){
			case 'Done':
				newStatus = 'success'
				break;
			case 'Failure':
				newStatus = 'danger';
				break;
			default:
				newStatus = 'waiting';
		};

		this.setState({
			status: newStatus
		});
	},
	
	componentWillReceiveProps: function(nextProps) {
		var newStatus = 'waiting';

		switch(nextProps.status){
			case 'Done':
				newStatus = 'success'
				break;
			case 'Failure':
				newStatus = 'danger';
				break;
			default:
				newStatus = 'waiting';
		};

		this.setState({
			status: newStatus
		});
	},

  render: function() {
  	var status = 'indicator-' + this.state.status;
  	var deploymentClasses = cx('indicator-circle', 'indicator-top', status);
  	var upStatusClasses = cx('indicator-circle', 'indicator-bottom', status);

    return(
      <div className='status-indicator'>
        <ul>
          <li><span className={deploymentClasses} /><span className='status-text'>{this.props.status}</span></li>
          <li><span className={upStatusClasses} /></li>
        </ul>
      </div>
    )}
});
 
module.exports = StatusIndicator;

