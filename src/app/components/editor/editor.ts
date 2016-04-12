import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {AceEditor} from './aceEditor';

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
@Component({
    selector: 'vamp-editor',
    inputs: [
        'initialContent',
        'editable',
    ],
    outputs: [
        'saveHandler: save',
        'changeHandler: change'
    ],
    templateUrl: 'app///components/editor/editor.html',
    directives: [CORE_DIRECTIVES, AceEditor],
    styles: []
})
export class Editor {
    editable:boolean = true;
    editMode:boolean = false;
    showEditButton:boolean = true;
    showSaveButton:boolean = true;

    unsavedChanges: boolean = false;

    original: string;
    modified: string;
    content: string;   // The one we show in the editor

    saveHandler:EventEmitter<any> = new EventEmitter();
    changeHandler:EventEmitter<any> = new EventEmitter();

    edit() {
        this.editMode = true;
    }

    save() {
        this.content = this.original = this.modified;
        this.saveHandler.next(this.modified);
        this.unsavedChanges = false;
        this.editMode = false;
    }

    cancel() {
        // Load the original text back
        this.content = this.original;
        this.unsavedChanges = false;
        this.editMode = false;
    }

    set initialContent(text: string){
        console.log("Setting initial text for editor");
        this.original = text;
        this.modified = text;
        this.content = text;
    }

    contentUpdate(event) {
        this.modified = event;
        if(this.modified !== this.original) {
          this.unsavedChanges = true;
        }
        // Pass the changed document up
        this.changeHandler.next(event);
    }
}
