var React = require('react');
var classNames = require('classnames');
var _ = require('underscore');
var Filterbox = require('./Filterbox.jsx');
var AddArtefactBox = require('./AddArtefactBox.jsx');

var ToolBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function(){
    return {
      toolbarState: '',
    };
  },

  setToolbar: function(newState){
    this.setState({ toolbarState: newState });
  },

  handleAdd: function(e){
    this.setState({ toolbarState: 'expanded' });
  },

  render: function() {

    var props = this.props;

    // Set dynamic classes for elements
    var toolbarClasses = classNames('toolbar', this.state.toolbarState);
    var addButtonClasses = classNames({
      'button': true,
      'button-pink': true,
      'add-button': true,
      'hidden': this.props.addArtefactType == undefined ? true : false
    });

    return (
      <section id="toolbar" className={toolbarClasses}>
        
        <Filterbox onUserInput={this.props.onUserInput} />
        <button className={addButtonClasses} onClick={this.handleAdd}>Add new</button>

        <AddArtefactBox {...props} setToolbar={this.setToolbar} />

      </section>
  )}

});
 
module.exports = ToolBar;