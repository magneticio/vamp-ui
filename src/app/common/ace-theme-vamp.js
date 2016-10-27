/* global ace */
/* eslint no-multi-str: "off" */
ace.define("ace/theme/vamp", ["require", "exports", "module", "ace/lib/dom"], function (require, exports) {
  exports.isDark = true;
  exports.cssClass = "ace-vamp";
  exports.cssText = ".ace-vamp .ace_gutter {\
background: transparent;\
color: #afbec8;\
}\
.ace-vamp .ace_print-margin {\
width: 0;\
background: #141e2d;\
}\
.ace-vamp {\
background-color: transparent;\
color: #C5C8C6;\
}\
.ace-vamp .ace_cursor {\
color: #C5C8C6;\
}\
.ace-vamp .ace_marker-layer .ace_selection {\
background: #373B41;\
}\
.ace-vamp.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #1D1F21;\
}\
.ace-vamp .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0);\
}\
.ace-vamp .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #4B4E55;\
}\
.ace-vamp .ace_marker-layer .ace_active-line {\
background: rgba(13, 30, 38, 0.5);\
}\
.ace-vamp .ace_gutter-active-line {\
background-color: transparent;\
}\
.ace-vamp .ace_marker-layer .ace_selected-word {\
border: 1px solid #373B41;\
}\
.ace-vamp .ace_invisible {\
color: #4B4E55;\
}\
.ace-vamp .ace_keyword,\
.ace-vamp .ace_meta,\
.ace-vamp .ace_storage,\
.ace-vamp .ace_storage.ace_type,\
.ace-vamp .ace_support.ace_type {\
color: #B294BB;\
}\
.ace-vamp .ace_keyword.ace_operator {\
color: #8ABEB7;\
}\
.ace-vamp .ace_constant.ace_character,\
.ace-vamp .ace_constant.ace_language,\
.ace-vamp .ace_constant.ace_numeric,\
.ace-vamp .ace_keyword.ace_other.ace_unit,\
.ace-vamp .ace_support.ace_constant,\
.ace-vamp .ace_variable.ace_parameter {\
color: #DE935F;\
}\
.ace-vamp .ace_constant.ace_other {\
color: #CED1CF;\
}\
.ace-vamp .ace_invalid {\
color: #CED2CF;\
background-color: #DF5F5F;\
}\
.ace-vamp .ace_invalid.ace_deprecated {\
color: #CED2CF;\
background-color: #B798BF;\
}\
.ace-vamp .ace_fold {\
background-color: #81A2BE;\
border-color: #C5C8C6;\
}\
.ace-vamp .ace_entity.ace_name.ace_function,\
.ace-vamp .ace_support.ace_function,\
.ace-vamp .ace_variable {\
color: #81A2BE;\
}\
.ace-vamp .ace_support.ace_class,\
.ace-vamp .ace_support.ace_type {\
color: #F0C674;\
}\
.ace-vamp .ace_heading,\
.ace-vamp .ace_markup.ace_heading,\
.ace-vamp .ace_string {\
color: #B5BD68;\
}\
.ace-vamp .ace_entity.ace_name.ace_tag,\
.ace-vamp .ace_entity.ace_other.ace_attribute-name,\
.ace-vamp .ace_meta.ace_tag,\
.ace-vamp .ace_string.ace_regexp,\
.ace-vamp .ace_variable {\
color: #CC6666;\
}\
.ace-vamp .ace_comment {\
color: #969896;\
}\
.ace-vamp .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) right repeat-y\
}";
  var dom = require("../lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
});
