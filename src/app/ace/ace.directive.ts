import {Component,Directive,EventEmitter,ElementRef} from 'angular2/core';

// declare the ace library
declare var ace: any;

/**
 * A directive to use the Ace editor for editing XML.
 * See https://github.com/hardbyte/angular2-bt-components/blob/master/app/components/markdown/aceEditor.ts
 */
@Directive({
    selector: 'ace-editor',
    inputs: [
        "text"
    ],
    outputs: [
        "textChanged"
    ]
})
export class AceDirective {
    private editor;
    public textChanged: EventEmitter<string>;

    /**
     * Sets the editor's text.
     */
    set text(s: string) {
        this.editor.setValue(s);
        this.editor.clearSelection();
        this.editor.focus();
    }

    constructor(elementRef: ElementRef) {
        this.textChanged = new EventEmitter<string>();

        // this is the <div ace-editor> root element
        let el = elementRef.nativeElement;
        console.log(el);
        el.classList.add("editor");
        //el.style.height = "250px";
        //el.style.width = "300px";
        this.editor = ace.edit(el);
        //this.editor.resize(true);
        this.editor.setTheme("ace/theme/monokai");
        this.editor.getSession().setMode("ace/mode/yaml");

        this.editor.on("change", (e) => {
            // discard the delta (e), and provide whole document
            this.textChanged.next(this.editor.getValue());
        });
    }
}
