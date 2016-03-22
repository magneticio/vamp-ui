System.register(['angular2/core', 'angular2/common', './aceEditor'], function(exports_1, context_1) {
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
    var core_1, common_1, aceEditor_1;
    var Editor;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (aceEditor_1_1) {
                aceEditor_1 = aceEditor_1_1;
            }],
        execute: function() {
            /**
             * Editable yaml component.
             *
             * ## Example
             *
             * Add to your html template:
             *
             * ```
             * <yaml-editor
             * (save)="updatedText($event)"
             * [initial-text]="yamlContent">
             * </yaml-editor>
             * ```
             *
             * Remember to include the `Yaml` **directive** in your `@View` annotation:
             *
             * ```directives: [Yaml]```
             *
             * ## Example
             *
             * You can also control the component with external ui:
             *
             * ```
             * <button (click)="md.editMode = true">Custom Edit Button</button>
             * <yaml-editor [initial-text]="welcome" [show-edit-button]="false" edit-mode="true" #md></yaml-editor>
             * ```
             *
             * ## Selectors
             *
             * `yaml-editor`
             *
             * ## Inputs
             *
             * - `editable` - default to true. If false; only render yaml - don't allow user to edit it.
             * - `editMode` - defaults to false. Show the editor or the rendered yaml.
             * - `showEditButton` - defaults to true. Should this component render an edit button.
             *
             * ### Events (Outputs)
             *
             * The two events that the `yaml-editor` component emits:
             *
             * - `save`
             * - `change`
             *
             * Note both events include the entire yaml document.
             *
             * ## Installation
             *
             * This component relies on library `ace editor` for editing yaml
             *
             * For now we can include the ace library directly:
             *
             * ```
             * <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.1.9/ace.js"></script>
             * <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.1.9/mode-yaml.js"></script>
             * ```
             *
             **/
            Editor = (function () {
                function Editor() {
                    this.editable = true;
                    this.editMode = false;
                    this.showEditButton = true;
                    this.showSaveButton = true;
                    this.unsavedChanges = false;
                    this.saveHandler = new core_1.EventEmitter();
                    this.changeHandler = new core_1.EventEmitter();
                }
                Editor.prototype.edit = function () {
                    this.editMode = true;
                };
                Editor.prototype.save = function () {
                    this.content = this.original = this.modified;
                    this.saveHandler.next(this.modified);
                    this.unsavedChanges = false;
                    this.editMode = false;
                };
                Editor.prototype.cancel = function () {
                    // Load the original text back
                    this.content = this.original;
                    this.unsavedChanges = false;
                    this.editMode = false;
                };
                Object.defineProperty(Editor.prototype, "initialContent", {
                    set: function (text) {
                        console.log("Setting initial text for editor");
                        this.original = text;
                        this.modified = text;
                        this.content = text;
                    },
                    enumerable: true,
                    configurable: true
                });
                Editor.prototype.contentUpdate = function (event) {
                    this.modified = event;
                    if (this.modified !== this.original) {
                        this.unsavedChanges = true;
                    }
                    // Pass the changed document up
                    this.changeHandler.next(event);
                };
                Editor = __decorate([
                    core_1.Component({
                        selector: 'editor',
                        inputs: [
                            'initialContent',
                            'editable',
                        ],
                        outputs: [
                            'saveHandler: save',
                            'changeHandler: change'
                        ],
                        templateUrl: 'app///components/editor/editor.html',
                        directives: [common_1.CORE_DIRECTIVES, aceEditor_1.AceEditor],
                        styles: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], Editor);
                return Editor;
            }());
            exports_1("Editor", Editor);
        }
    }
});
//# sourceMappingURL=../../../../../app/components/editor/editor.js.map