var React = require('react');
var classNames = require('classnames');
var _ = require('underscore');
var LoadStates = require("../../constants/LoadStates");
var BlueprintStore = require('../../stores/BlueprintStore');
var BreedStore = require('../../stores/BreedStore');

var AddArtefactBox = React.createClass({

  // Etc
  clearStates: {
    newArtefact: '',
    errorMessage: '',
    editArtefact: false,
    dirty: false
  },

  // Component lifecycle
  getInitialState: function(){
    return {
      newArtefact: '',
      errorMessage: '',
      dirty: false,
      editArtefact: false,
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if(this.state.newArtefact && nextProps.requestResolved){
      this.handleCancel();
    }
    if(!_.isEmpty(nextProps.detailArtefact) && !this.state.dirty){
      this.activateEditArtefact(nextProps);
    }
    if(nextProps.detailArtefact != this.props.detailArtefact && !_.isEmpty(nextProps.detailArtefact)){
      this.activateEditArtefact(nextProps);
    }
  },
  componentDidMount: function(){
    this._initArtefactFunctions();
  },
  componentWillUnmount: function(){
    this._destroyArtefactFunctions();
  },

  // Event handlers
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.getDOMNode().value
    );
  },
  handleUpload: function(e){
    var self = this;
    var reader = new FileReader();
    var file = e.target.files[0];

    reader.onload = function(upload) {
      self.setState({
        newArtefact: upload.target.result,
      });
    }
    reader.readAsText(file);
  },
  handleCancel: function(e){
    if(e)
      e.preventDefault();
    
    var self = this;
    React.findDOMNode(this.refs.AddNewForm).reset();    
    this.setState(this.clearStates);
    this.props.setToolbar('');
    this.props.clearDetailArtefact();
  },
  handleTextareaChange: function(e){
    this.setState({newArtefact: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();
    this.setState({ 
      errorMessage: '',
      buttonLoadsate: 'active',
    });
    _.isEmpty(this.props.detailArtefact) ? this.props.handleAdd(this.state.newArtefact) : this.props.handleUpdate(this.state.newArtefact);
  },

  // Helpers
  activateEditArtefact: function(nextProps){
    this.props.setToolbar('expanded');
    this.setState({ 
      newArtefact: nextProps.detailArtefact,
      dirty: true,
      editArtefact: true
    });
    React.findDOMNode(this.refs.inputfield).focus();
  },

  // Render
  render: function() {

    // Setup text and title of edit box
    if(!_.isEmpty(this.props.detailArtefact)){
      var artefactTitle = (<h2>Edit {this.props.addArtefactType}</h2>);  
      var artefactMessage = (<p>Edit the contents of your {this.props.addArtefactType} below.</p>);
    } else {
      var artefactTitle = (<h2>Adding a new {this.props.addArtefactType}</h2>);  
      var artefactMessage = (<p>Type or paste the contents of your {this.props.addArtefactType}, or upload a YAML file and edit its contents.</p>);
    }

    // Setup dynamic classes
    var dialogClasses = classNames({
      'dialog': true,
      'dialog-danger': true,
      'dialog-empty': this.state.errorMessage == '' ? true : false
    });
    var saveButtonClasses = classNames({
      "active": this.props.loadState == LoadStates.STATE_LOADING,
      "button": true,
      "button-pink": true,
      "save-button": true
    });
    var uploadButtonClasses = classNames({
      "button": true,
      "button-ghost": true,
      "upload-button": true,
      "hidden": !_.isEmpty(this.props.detailArtefact) ? true : false,
    });

    return(
      <form className='add-artefact-box' onSubmit={this.handleSubmit} ref='AddNewForm'>
        {artefactTitle}
        {artefactMessage}
        <div className='actions'>
          <button className="button button-ghost cancel-button" onClick={this.handleCancel}>Cancel</button>
          <span className={uploadButtonClasses}> 
            Upload file<input type='file' onChange={this.handleUpload} />
          </span>
          <input type='submit' className={saveButtonClasses} value='Save' />
        </div>
        <p className={dialogClasses}>{this.state.errorMessage}</p>
        <textarea className='inputfield' ref="inputfield" value={this.state.newArtefact} onChange={this.handleTextareaChange} rows='15'></textarea>
      </form>
  )},

  _onChange: function() {
    var errorMessage = this._getErrorMessage();

    if(errorMessage)
      this.setState({ errorMessage: errorMessage });
  },

  _initArtefactFunctions: function(){
    if(this.props.addArtefactType == 'breed')
      BreedStore.addChangeListener(this._onChange);
    
    if(this.props.addArtefactType == 'blueprint')
      BlueprintStore.addChangeListener(this._onChange);
  },
  _destroyArtefactFunctions: function(){
    if(this.props.addArtefactType == 'breed')
      BreedStore.removeChangeListener(this._onChange);
    
    if(this.props.addArtefactType == 'blueprint')
      BlueprintStore.removeChangeListener(this._onChange);
  },
  _getErrorMessage: function(){
    if(this.props.addArtefactType == 'breed')
      return BreedStore.getError();
    
    if(this.props.addArtefactType == 'blueprint')
      return BlueprintStore.getError();
  }  

});
 
module.exports = AddArtefactBox;