import './assets/Editor.styl'

import * as React from 'react';
import * as classNames from 'classnames';
import { TextChangeEventArgs } from '../Core/TextEditing';

type TEditorProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & {
    value: string;
    onChange?: (event: TextChangeEventArgs) => void;
    isFocused?: boolean;
    className?: string;
    height?: number | string;
    autoResize?: boolean;
    tabIndex?: number;
}

type TEditorState = {
    height: number;
}

export class Editor extends React.Component<TEditorProps, TEditorState> {

    static defaultProps = {
        isFocused: false,
        autoResize: false
    }

    constructor(props) {
        super(props);

        this.state = {
            height: props.height
        };
    }

    private resolveFocus() {
        if (this.props.isFocused) {
            this.editor.focus();
            this.autoResize();
        }
    }

    componentDidMount() {
        this.resolveFocus();
    }

    componentDidUpdate(prevProps: TEditorProps) {
        if (prevProps.isFocused !== this.props.isFocused) {
            this.resolveFocus();
        }
    }

    autoResize() {
        if (this.props.autoResize) {
            this.setState({ height: this.editor.scrollHeight });
        }
    }

    get editor() {
        return this.refs.Editor as HTMLTextAreaElement;
    }

    handleInput = () => {
        this.autoResize();
    }

    handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(event.keyCode === 9) {
            const { editor } = this, { selectionStart, selectionEnd } = editor;
            const target = event.target as HTMLTextAreaElement;
            const { value } = target;
            target.value = `${value.substring(0, selectionStart)}\t${value.substring(selectionEnd)}`;
            editor.selectionStart = editor.selectionEnd = selectionStart + 1;
            event.preventDefault();
        }
    }

    render() {
        const { value, className, onChange, ...props } = this.props;
        const { height } = this.state;

        return (
            <textarea
                ref="Editor"
                className={classNames('Editor form-control', className)}
                onChange={onChange}
                onInput={this.handleInput}
                style={{ height }}
                onKeyDown={this.handleKeyDown}
                value={value}
                {...props}
            />
        )
    }
}