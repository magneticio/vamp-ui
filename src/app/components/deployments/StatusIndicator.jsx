var React = require('react');
var cx = require('classnames');

var StepIndicator = React.createClass({

	getInitialState: function(){
		return {
			step: 'waiting'
		};
	},

	componentWillMount: function(){
		var newStep = 'waiting';

		switch(this.props.step){
			case 'Done':
				newStep = 'success'
				break;
			case 'Failure':
				newStep = 'danger';
				break;
			default:
				newStep = 'waiting';
		};

		this.setState({
			step: newStep
		});
	},
	
	componentWillReceiveProps: function(nextProps) {
		var newStep = 'waiting';

		switch(nextProps.step){
			case 'Done':
				newStep = 'success'
				break;
			case 'Failure':
				newStep = 'danger';
				break;
			default:
				newStep = 'waiting';
		};

		this.setState({
			step: newStep
		});
	},

  render: function() {
  	var step = 'indicator-' + this.state.step;
  	var deploymentClasses = cx('indicator-circle', 'indicator-top', step);
  	var upStatusClasses = cx('indicator-circle', 'indicator-bottom', step);

    return(
      <div className='status-indicator'>
        <ul>
          <li><span className={deploymentClasses} /><span className='status-text'>{this.renderStep()}</span></li>
          <li><span className={upStatusClasses} /></li>
        </ul>
      </div>
    )
  },

  renderStep: function() {
  	var percentage;

  	switch (this.props.step) {
  		case 'Initiated':
  			percentage = '0% ';
  			break;

  		case 'ContainerUpdate':
  			percentage = (this.props.intention === 'Deploy') ? '33% ' : '67% ';
        break;

  		case 'RouteUpdate':
      	percentage = (this.props.intention === 'Deploy') ? '67% ' : '33% ';
        break;

      default:
        percentage = '';
        break;
  	}

  	return percentage + this.props.step.replace(/([a-z](?=[A-Z]))/g, '$1 ');
  }
});
 
module.exports = StepIndicator;

