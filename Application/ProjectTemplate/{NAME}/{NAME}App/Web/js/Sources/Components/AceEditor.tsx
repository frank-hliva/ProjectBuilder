import * as React from 'react';
import * as isEqual from 'deep-equal';
import dynamicLoader from '../Core/DynamicLoader';
import { TTextChangeEventArgs } from '../Core/TextEditing';
import wait from '../Core/Wait';

const editorOptions = [
    'minLines',
    'maxLines',
    'readOnly',
    'highlightActiveLine',
    'tabSize',
    'enableBasicAutocompletion',
    'enableLiveAutocompletion',
    'enableSnippets'
];

type TAceEditorProps = {
    name?: string;
    className?: string;
    onBeforeLoad?: (ace: any) => void;
    mode?: string;
    isFocused?: boolean;
    theme?: string;
    fontSize?: number | string;
    value?: string;
    defaultValue?: string;
    cursorStart?: number;
    showGutter?: boolean;
    wrapEnabled?: boolean;
    showPrintMargin?: boolean;
    keyboardHandler?: string;
    onLoad?: (editor: any) => void;
    commands?: string[];
    annotations?: string[];
    markers?: string[];
    editorProps?: {};
    width?: string | number;
    height?: string | number;
    style?: React.CSSProperties;
    setOptions?: {};
    onChange?: (event: TTextChangeEventArgs) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onCopy?: (text: string) => void;
    onPaste?: (text: string) => void;
    onScroll?: (editor: any) => void;
    minLines?: number;
    maxLines?: number;
    readOnly?: boolean;
    highlightActiveLine?: boolean;
    tabSize?: number;
    enableBasicAutocompletion?: boolean;
    enableLiveAutocompletion?: boolean;
    enableSnippets?: boolean;
    tabIndex?: number;
    onDropFiles?: (event: React.DragEvent<HTMLTextAreaElement>, editor: any) => void;
}

type TAceEditorState = {
    name?: string;
    className?: string;
    onBeforeLoad?: (ace: any) => void;
    mode?: string;
    isFocused?: boolean;
    theme?: string;
    fontSize?: number | string;
    value?: string;
    defaultValue?: string;
    cursorStart?: number;
    showGutter?: boolean;
    wrapEnabled?: boolean;
    showPrintMargin?: boolean;
    keyboardHandler?: string;
    onLoad?: (editor: any) => void;
    commands?: string[];
    annotations?: string[];
    markers?: string[];
    editorProps?: {};
    width?: string | number;
    height?: string | number;
    style?: React.CSSProperties;
    setOptions?: {};
    onChange?: (event: TTextChangeEventArgs) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onCopy?: (text: string) => void;
    onPaste?: (text: string) => void;
    onScroll?: (editor: any) => void;
    minLines?: number;
    maxLines?: number;
    readOnly?: boolean;
    highlightActiveLine?: boolean;
    tabSize?: number;
    enableBasicAutocompletion?: boolean;
    enableLiveAutocompletion?: boolean;
    enableSnippets?: boolean;
    tabIndex?: number;
}

export class AceEditor extends React.Component<TAceEditorProps, TAceEditorState> {

    static defaultProps = {
        name: 'brace-editor',
        isFocused: false,
        mode: '',
        theme: '',
        width: '100%',
        height: '400px',
        value: '',
        fontSize: 15,
        showGutter: true,
        readOnly: false,
        highlightActiveLine: true,
        showPrintMargin: false,
        tabSize: 4,
        cursorStart: 1,
        editorProps: {},
        setOptions: {},
        wrapEnabled: false,
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        className: ""
    }

    private editor: any;
    private silent: boolean = false;

    constructor(props) {
        super(props);
        [
            'onChange',
            'onFocus',
            'onBlur',
            'onCopy',
            'onPaste',
            'onScroll',
            'handleOptions',
            'onDropFiles'
        ].forEach(method => {
            this[method] = this[method].bind(this);
        });
    }

    componentDidMount() {
        wait({
            predicate: () => 
                dynamicLoader.js.contains('/js/ace/src-min-noconflict/ace.js') &&
                dynamicLoader.js.contains('/js/ace/src-min-noconflict/ext-drop_files.js'),
            success: () => this.initAce()
        });
    }

    protected get editorRef() {
        return this.refs.editor as HTMLDivElement;
    }

    protected initAce() {

        const {
            name,
            className,
            onBeforeLoad,
            mode,
            isFocused,
            theme,
            fontSize,
            value,
            defaultValue,
            cursorStart,
            showGutter,
            wrapEnabled,
            showPrintMargin,
            keyboardHandler,
            onLoad,
            commands,
            annotations,
            markers,
            tabIndex
        } = this.props;

        const { ace } = window as any;
        this.editor = ace.edit(this.editorRef);
        ace.require('ace/ext/drop_files').init(this.editor, this.onDropFiles);

        if (onBeforeLoad) {
            onBeforeLoad(ace);
        }

        if (tabIndex !== undefined) {
            this.editor.textInput.getElement().tabIndex = tabIndex;
        }

        const editorProps = Object.keys(this.props.editorProps as {});
        for (let i = 0; i < editorProps.length; i++) {
            this.editor[editorProps[i]] = (this.props.editorProps as {})[editorProps[i]];
        }

        this.editor.getSession().setMode(`ace/mode/${mode}`);
        this.editor.setTheme(`ace/theme/${theme}`);
        this.editor.setFontSize(fontSize);
        this.editor.setValue(defaultValue === undefined ? value : defaultValue, cursorStart);
        this.editor.renderer.setShowGutter(showGutter);
        this.editor.getSession().setUseWrapMode(wrapEnabled);
        this.editor.setShowPrintMargin(showPrintMargin);
        this.editor.on('focus', this.onFocus);
        this.editor.on('blur', this.onBlur);
        this.editor.on('copy', this.onCopy);
        this.editor.on('paste', this.onPaste);
        this.editor.on('change', this.onChange);
        this.editor.session.on('changeScrollTop', this.onScroll);

        this.handleOptions(this.props);
        this.editor.getSession().setAnnotations(annotations || []);
        this.handleMarkers(markers || []);

        const availableOptions = this.editor.$options;
        for (let i = 0; i < editorOptions.length; i++) {
            const option = editorOptions[i];
            if (availableOptions.hasOwnProperty(option)) {
                this.editor.setOption(option, this.props[option]);
            }
        }

        if (Array.isArray(commands)) {
            commands.forEach((command) => {
                this.editor.commands.addCommand(command);
            });
        }

        if (keyboardHandler) {
            this.editor.setKeyboardHandler(`ace/keyboard/${keyboardHandler}`);
        }

        if (className) {
            this.editorRef.className += ` ${className}`;
        }

        if (isFocused) {
            this.editor.focus();
        }
        if (onLoad) {
            onLoad(this.editor);
        }
    }

    componentWillReceiveProps(nextProps: TAceEditorProps) {
        const oldProps = this.props;
        for (let i = 0; i < editorOptions.length; i++) {
            const option = editorOptions[i];
            if (nextProps[option] !== oldProps[option]) {
                this.editor.setOption(option, nextProps[option]);
            }
        }
        if (nextProps.className !== oldProps.className) {
            let appliedClasses = this.editorRef.className;
            let appliedClassesArray = appliedClasses.trim().split(' ');
            let oldClassesArray = (oldProps.className as string).trim().split(' ');
            oldClassesArray.forEach((oldClass) => {
                let index = appliedClassesArray.indexOf(oldClass);
                appliedClassesArray.splice(index, 1);
            });
            this.editorRef.className = ' ' + nextProps.className + ' ' + appliedClassesArray.join(' ');
        }
        if (nextProps.mode !== oldProps.mode) {
            this.editor.getSession().setMode('ace/mode/' + nextProps.mode);
        }
        if (nextProps.theme !== oldProps.theme) {
            this.editor.setTheme('ace/theme/' + nextProps.theme);
        }
        if (nextProps.keyboardHandler !== oldProps.keyboardHandler) {
            if (nextProps.keyboardHandler) {
                this.editor.setKeyboardHandler(`ace/keyboard/${nextProps.keyboardHandler}`);
            } else {
                this.editor.setKeyboardHandler(null);
            }
        }
        if (nextProps.fontSize !== oldProps.fontSize) {
            this.editor.setFontSize(nextProps.fontSize);
        }
        if (nextProps.wrapEnabled !== oldProps.wrapEnabled) {
            this.editor.getSession().setUseWrapMode(nextProps.wrapEnabled);
        }
        if (nextProps.showPrintMargin !== oldProps.showPrintMargin) {
            this.editor.setShowPrintMargin(nextProps.showPrintMargin);
        }
        if (nextProps.showGutter !== oldProps.showGutter) {
            this.editor.renderer.setShowGutter(nextProps.showGutter);
        }
        if (!isEqual(nextProps.setOptions, oldProps.setOptions)) {
            this.handleOptions(nextProps);
        }
        if (!isEqual(nextProps.annotations, oldProps.annotations)) {
            this.editor.getSession().setAnnotations(nextProps.annotations || []);
        }
        if (!isEqual(nextProps.markers, oldProps.markers)) {
            this.handleMarkers(nextProps.markers || []);
        }
        if (this.editor && this.editor.getValue() !== nextProps.value) {
            this.silent = true;
            const pos = this.editor.session.selection.toJSON();
            this.editor.setValue(nextProps.value, nextProps.cursorStart);
            this.editor.session.selection.fromJSON(pos);
            this.silent = false;
        }
        if (nextProps.isFocused && !oldProps.isFocused) {
            this.editor.focus();
        }
        if (nextProps.height !== this.props.height) {
            this.editor.resize();
        }
    }

    componentWillUnmount() {
        this.editor.destroy();
        this.editor = null;
    }

    onChange() {
        if (this.props.onChange && !this.silent) {
            this.props.onChange({
                target: {
                    value: this.editor.getValue() as string
                }
            });
        }
    }

    onFocus() {
        if (this.props.onFocus) {
            this.props.onFocus();
        }
    }

    onBlur() {
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    }

    onCopy(text) {
        if (this.props.onCopy) {
            this.props.onCopy(text);
        }
    }

    onPaste(text) {
        if (this.props.onPaste) {
            this.props.onPaste(text);
        }
    }

    onScroll() {
        if (this.props.onScroll) {
            this.props.onScroll(this.editor);
        }
    }

    handleOptions(props) {
        const setOptions = Object.keys(props.setOptions);
        for (let y = 0; y < setOptions.length; y++) {
            this.editor.setOption(setOptions[y], props.setOptions[setOptions[y]]);
        }
    }

    onDropFiles(event: React.DragEvent<HTMLTextAreaElement>, editor: any) {
        if (this.props.onDropFiles) {
            this.props.onDropFiles(event, editor);
        }
    }

    handleMarkers(markers) {

        let currentMarkers = this.editor.getSession().getMarkers(true);
        for (const i in currentMarkers) {
            if (currentMarkers.hasOwnProperty(i)) {
                this.editor.getSession().removeMarker(currentMarkers[i].id);
            }
        }

        currentMarkers = this.editor.getSession().getMarkers(false);
        for (const i in currentMarkers) {
            if (currentMarkers.hasOwnProperty(i)) {
                this.editor.getSession().removeMarker(currentMarkers[i].id);
            }
        }

        markers.forEach(({
            startRow,
            startCol,
            endRow,
            endCol,
            className,
            type,
            inFront = false
        }) => {
            const range = new (Range as any)(startRow, startCol, endRow, endCol);
            this.editor.getSession().addMarker(range, className, type, inFront);
        });
    }

    render() {
        const {
            name,
            width,
            height,
            style
        } = this.props;

        return (
            <div
                id={name}
                ref="editor"
                className="AceEditor"
                style={{
                    width,
                    height,
                    ...style
                }}
            />
        );
    }
}