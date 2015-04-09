var React = require('react');
var Yaml = require('yamljs');
var Modal = require('react-bootstrap').Modal;
var BlueprintActions = require('../actions/BlueprintActions.js')
var OverlayMixin = require('react-bootstrap').OverlayMixin;

var BlueprintsButtonBar = React.createClass({

  mixins: [OverlayMixin],

  getInitialState: function() {
    return {
      isModalOpen: false,
      blueprintYaml: '',
      blueprintJson: {},
      validYaml: false
    };
  },

  onChange: function(e){
    this.setState({
      blueprintYaml: e.target.value
    })
    this.checkYaml(e.target.value)
  },

  checkYaml: function(input) {
    try {
        var object = Yaml.parse(input)
        this.setState({
          validYaml : true,
          blueprintJson: object
        })
    } catch(err) {
        this.setState({
          validYaml : false,
          blueprintJson: {}
        })
    } 
  },

  handleSubmit: function(){

    console.log('submitting: ' + this.state.blueprintJson)
    BlueprintActions.createBlueprint(this.state.blueprintJson)
    this.handleToggle()
  },

  handleToggle: function() {

    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },


  render: function() {
    
    return(
      <div className='row top-button-bar'>
        <div className='col-md-12'>
            <button className='btn btn-info-inverse pull-left' onClick={this.handleToggle}>Add blueprint</button>
        </div>
      </div>
    )},

  renderOverlay: function() {

      if (!this.state.isModalOpen) {
        return <span/>;
      }

      var disabled = (this.state.validYaml && this.state.blueprintYaml != '') ? '' : 'disabled' 


      return (
        <Modal title='Submit a blueprint in YAML' onRequestHide={this.handleToggle}>
          <div className='modal-body'>
              <form className='form' onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <textarea className="form-control" rows="15" id="yaml-blueprint" blueprintYaml={this.state.blueprintYaml} onInput={this.onChange}></textarea>
                </div>
                <button type='submit' className='btn btn-info' disabled={disabled}>Add blueprint</button>
              </form>
          </div>
        </Modal>
      );
    }
});

module.exports = BlueprintsButtonBar;
