var React = require('react');
var cx = require('classnames');
var _ = require('underscore')
var LoadStates = require("../constants/LoadStates.js");
var BreedStore = require('../stores/BreedStore');
var BlueprintStore = require('../stores/BlueprintStore');

var ToolBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },
  clearStates: {
    toolbarState: '',
    buttonLoadsate: '',
    newArtefact: '',
    errorMessage: '',
    editArtefact: false,
    dirty: false
  },

  getInitialState: function(){
    return {
      toolbarState: '',
      buttonLoadsate: '',
      newArtefact: '',
      errorMessage: '',
      dirty: false,
      editArtefact: false
    };
  },
  componentDidMount: function(){
    this._initArtefactFunctions();
  },
  componentWillUnmount: function(){
    this._destroyArtefactFunctions();
  },
  componentWillReceiveProps: function(nextProps) {
    if(this.state.newArtefact && nextProps.requestResolved){
      this.handleCancel();
    }
    if(!_.isEmpty(nextProps.detailArtefact) && !this.state.dirty){
      formattedArtefact = nextProps.detailArtefact;
      this.setState({ 
        newArtefact: formattedArtefact,
        dirty: true,
        editArtefact: true,
        toolbarState: 'expanded'
      });
    }
  },
  
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.getDOMNode().value
    );
  },
  handleClick: function(e, viewType){
    e.preventDefault();
    this.props.handleViewSwitch(viewType);
  },
  handleAdd: function(e){
    this.setState({ toolbarState: 'expanded' });
    React.findDOMNode(this.refs.inputfield).focus();
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

    // Timeout is needed for animation to complete, otherwise ugly flash of 2 messages appears
    setTimeout(function(){
      self.props.clearDetailArtefact();
    }, 200);
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

  render: function() {

    // Set dynamic classes for elements
    var toolbarClasses = cx('toolbar', this.state.toolbarState);
    var addButtonClasses = cx({
      'button': true,
      'button-pink': true,
      'add-button': true,
      'hidden': this.props.addArtefactType == undefined ? true : false
    })
    var dialogClasses = cx({
      'dialog': true,
      'dialog-danger': true,
      'dialog-empty': this.state.errorMessage == '' ? true : false
    });
    var saveButtonClasses = cx({
      "active": this.props.loadState == LoadStates.STATE_LOADING,
      "button": true,
      "button-pink": true,
      "save-button": true
    });
    var uploadButtonClasses = cx({
      "button": true,
      "button-ghost": true,
      "upload-button": true,
      "hidden": !_.isEmpty(this.props.detailArtefact) ? true : false,
    });

    if(!_.isEmpty(this.props.detailArtefact)){
      var artefactTitle = (<h2>Edit {this.props.addArtefactType}</h2>);  
      var artefactMessage = (<p>Edit the contents of your {this.props.addArtefactType} below.</p>);
    } else {
      var artefactTitle = (<h2>Adding a new {this.props.addArtefactType}</h2>);  
      var artefactMessage = (<p>Type or paste the contents of your {this.props.addArtefactType}, or upload a YAML file and edit its contents.</p>);
    }

    return (
      <section id="toolbar" className={toolbarClasses}>
        <div className='filtering-tools-box'>
          <button className="view-switch hidden" onClick={this.handleClick.bind(this,'general-list')}><img src="/images/unordered-list.svg" alt="list icon" width="20px" height="20px" /></button>
          <button className="view-switch hidden" onClick={this.handleClick.bind(this,'card-list')}><img src="/images/grid-large.svg" alt="card icon" width="20px" height="20px" /></button>
          <form className="search-form" onSubmit={this.handleSubmit}>
            <label htmlFor="searchfield">
              <img src="/images/search.svg" alt="search icon" width="16px" height="16px" className="search-icon" />
              <input id="searchfield" 
                type="search" 
                placeholder="Search" 
                name="searchfield" 
                value={this.props.filterText}
                ref="filterTextInput"
                onChange={this.handleChange} />
            </label>
          </form>
          <button className={addButtonClasses} onClick={this.handleAdd}>Add new</button>
        </div>

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

      </section>
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
 
module.exports = ToolBar;