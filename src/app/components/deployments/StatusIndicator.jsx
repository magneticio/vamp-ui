var React = require('react');
var cx = require('classnames');

var StatusIndicator = React.createClass({

	getInitialState: function(){
		return {
			status: 'waiting'
		};
	},
	componentWillMount: function(){
		var newStatus;

		switch(this.props.status){
			case 'Deployed':
				newStatus = 'success'
				break;
			case 'Error':
				newStatus = 'danger';
				break;
			case 'ReadyForDeployment':
				newStatus = 'waiting';
				break;
			default:
				newStatus = 'waiting';
		};

		this.setState({
			status: newStatus
		});
	},
	
	componentWillReceiveProps: function(nextProps){
		var newStatus;

		switch(nextProps.status){
			case 'Deployed':
				newStatus = 'success'
				break;
			case 'Error':
				newStatus = 'danger';
				break;
			case 'ReadyForDeployment':
				newStatus = 'waiting';
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
    return(
      <div className='status-indicator'>
        <ul>
          <li><span className={deploymentClasses} /><span className='status-text'>{this.props.status}</span></li>
          <li><span className='indicator-circle indicator-bottom indicator-success' />up</li>
        </ul>
      </div>
    )}
});
 
module.exports = StatusIndicator;

