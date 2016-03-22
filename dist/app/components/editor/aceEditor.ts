import {ElementRef} from 'angular2/core';
import {Directive, EventEmitter} from 'angular2/core';

//declare the ace library as Magic;
declare var ace:any;

// This code is adapted from:
// https://github.com/hardbyte/angular2-bt-components/tree/master/app/components/markdown

@Directive({
    selector: '[ace-editor]',
    inputs: [
        'content'
    ],
    outputs: ['contentChange: change']
})
export class AceEditor {
    // http://ace.c9.io/#nav=api&api=editor
    editor;

    /** When the yaml content changes we broadcast the entire document. */
    contentChange: EventEmitter<any> = new EventEmitter();

    constructor(elementRef: ElementRef) {
        // Note the constructor doesn't have access to any data from properties
        // We can instead use a setter

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

        this.editor.on("change", (e) => {
            // Discard the delta (e), and provide whole document
            this.contentChange.next(this.editor.getValue());
        });

    }

    set content(text){
        this.editor.setValue(text);
        this.editor.clearSelection();
        this.editor.focus();
    }


}
