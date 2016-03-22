System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, core_2;
    var AceEditor;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            }],
        execute: function() {
            // This code is adapted from:
            // https://github.com/hardbyte/angular2-bt-components/tree/master/app/components/markdown
            AceEditor = (function () {
                function AceEditor(elementRef) {
                    // Note the constructor doesn't have access to any data from properties
                    // We can instead use a setter
                    var _this = this;
                    /** When the yaml content changes we broadcast the entire document. */
                    this.contentChange = new core_2.EventEmitter();
                    // This is the <div ace-editor> root element
                    // Ideally this wouldn't be required
                    var el = elementRef.nativeElement;
                    el.classList.add("editor");
                    el.style.height = "800px";
                    this.editor = ace.edit(el);
                    //this.editor.setTheme("ace/theme/xcode");
                    this.editor.getSession().setMode("ace/mode/yaml");
                    this.editor.getSession().setTabSize("2");
                    this.editor.getSession().setUseSoftTabs(false);
                    //this.editor.$blockScrolling = Infinity;
                    this.editor.on("change", function (e) {
                        // Discard the delta (e), and provide whole document
                        _this.contentChange.next(_this.editor.getValue());
                    });
                }
                Object.defineProperty(AceEditor.prototype, "content", {
                    set: function (text) {
                        this.editor.setValue(text);
                        this.editor.clearSelection();
                        this.editor.focus();
                    },
                    enumerable: true,
                    configurable: true
                });
                AceEditor = __decorate([
                    core_2.Directive({
                        selector: '[ace-editor]',
                        inputs: [
                            'content'
                        ],
                        outputs: ['contentChange: change']
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], AceEditor);
                return AceEditor;
            }());
            exports_1("AceEditor", AceEditor);
        }
    }
});
//# sourceMappingURL=../../../../../app/components/editor/aceEditor.js.map