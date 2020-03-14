export type TTextChangeEventArgs = {
    target: { value: string; }
}

export enum TEditorFocus {
    Name,
    Body
}

export enum TCaretPosition {
    Start,
    End
}

export module ContentEditable {

    export function focus(contentEditableElement: HTMLElement, caretPosition: TCaretPosition) {
        contentEditableElement.focus();
        if (
            typeof window.getSelection != "undefined" &&
            typeof document.createRange != "undefined"
        ) {
            let range = document.createRange();
            range.selectNodeContents(contentEditableElement);
            range.collapse(caretPosition === TCaretPosition.Start);
            let selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }
        } else if (typeof (document.body as any).createTextRange != "undefined") {
            let textRange = (document.body as any).createTextRange();
            textRange.moveToElementText(contentEditableElement);
            textRange.collapse(caretPosition === TCaretPosition.Start);
            textRange.select();
        }
    }
}