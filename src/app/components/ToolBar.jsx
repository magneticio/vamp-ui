var React = require('react');
var cx = require('classnames');

var ToolBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function(){
    return {
      toolbarState: '',
      animations: '',
      newArtefact: ''
    }
  },
  
  handleChange: function() {
    this.props.onUserInput(
        this.refs.filterTextInput.getDOMNode().value
    );
  },
  handleSubmit: function(e){
    e.preventDefault();
  },
  handleClick: function(viewType){
    this.props.handleViewSwitch(viewType);
  },
  handleAdd: function(e){
    this.setState({
      toolbarState: 'expanded',
      animations: 'fadeInUp'
    });
    React.findDOMNode(this.refs.inputfield).focus();
  },
  handleUpload: function(e){
    var self = this;
    var reader = new FileReader();
    var file = e.target.files[0];

    reader.onload = function(upload) {
      console.log(upload.target.result);
      self.setState({
        newArtefact: upload.target.result,
      });
    }
    //reader.readAsDataURL(file);
    reader.readAsText(file);
  },
  handleAddSubmit: function(e){
    e.preventDefault();
  },
  handleCancel: function(e){
    this.setState({
      toolbarState: '',
      newArtefact: ''
    });
    React.findDOMNode(this.refs.AddNewForm).reset();
  },
  handleSave: function(e){
    this.props.handleAdd();
  },
  handleChange: function(e){
    this.setState({newArtefact: e.target.value});
  },

  render: function() {

    var toolbarClasses = cx('toolbar', this.state.toolbarState);

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
          <button className="button button-pink add-button" onClick={this.handleAdd}>Add new</button>
        </div>

        <form className='add-artefact-box' onSubmit={this.handleAddSubmit} ref='AddNewForm'>
            <h2>Adding a new {this.props.addArtefactType}</h2>
            <p>Type or paste the contents of your {this.props.addArtefactType}, or drag a JSON file to this modal to upload.</p>
            <div className='actions'>
              <button className="button button-ghost cancel-button" onClick={this.handleCancel}>Cancel</button>
              <input type='file' className="button button-ghost upload-button" onChange={this.handleUpload} />
              <input type='submit' className="button button-pink save-button" onClick={this.handleSave} value='Save' />
            </div>
            <textarea className='inputfield' ref="inputfield" value={this.state.newArtefact} onChange={this.handleChange}></textarea>
        </form>

      </section>
  )}
});
 
module.exports = ToolBar;