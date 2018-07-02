import * as React from 'react';
import * as classNames from 'classnames';
import { TTextChangeEventArgs, TCaretPosition, ContentEditable as ContentEditableElement } from '../Core/TextEditing';
import { Omit } from '../Lib/Types';

type HTMLElementProps = 
    Omit<Omit<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>, 'onChange'>, 'onKeyDown'>, 'onKeyUp'>;

export type TContentChangeEventArgs = TTextChangeEventArgs & {
    contentEditableElement: HTMLElement;
}

type TContentEditableProps = HTMLElementProps & {
    value: string;
    tagName?: string;
    onChange?: (event: TContentChangeEventArgs, formEvent: React.FormEvent<HTMLElement>) => void;
    onKeyDown?: (event: TContentChangeEventArgs, keyboardEvent: React.KeyboardEvent<HTMLElement>) => void;
    onKeyUp?: (event: TContentChangeEventArgs, keyboardEvent: React.KeyboardEvent<HTMLElement>) => void;
    isEditable?: boolean;
    isFocused?: boolean;
    className?: string;
    caretPosition?: TCaretPosition;
}

export class ContentEditable extends React.Component<TContentEditableProps> {

    static defaultProps = {
        tagName: 'div',
        isEditable: true,
        isFocused: false,
        caretPosition: TCaretPosition.End
    }

    private lastValue: string = '';
    
    componentDidMount() {
        if (this.props.isFocused) {
            this.focus();
        }
    }

    shouldComponentUpdate(nextProps: TContentEditableProps) {
        return (
            this.editor.innerHTML !== nextProps.value ||
            this.props.isEditable !== nextProps.isEditable ||
            this.props.isFocused !== nextProps.isFocused
        );
    }

    protected get editor() {
        return this.refs.ContentEditable as HTMLElement;
    }

    protected focus() {
        if (this.editor !== document.activeElement) {
            ContentEditableElement.focus(this.editor, this.props.caretPosition as TCaretPosition);
        }
    }

    private handleClick = () => {
        this.focus();
    }

    protected emitChange = (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const value = this.editor.innerHTML;

        if (this.props.onChange && value !== this.lastValue) {
            this.props.onChange({
                target: { value },
                contentEditableElement: this.editor
            }, event);
        }
        this.lastValue = value;
    }

    protected emitKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (this.props.onKeyDown) {
            this.props.onKeyDown({
                target: { value: this.editor.innerHTML },
                contentEditableElement: this.editor 
            }, event);
        }
    }

    protected emitKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
        if (this.props.onKeyUp) {
            this.props.onKeyUp({
                target: { value: this.editor.innerHTML },
                contentEditableElement: this.editor
            }, event);
        }
    }

    private handleFocus = (event: React.FocusEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }

    private handleBlur = (event: React.FocusEvent<HTMLElement>) => {
        this.emitChange(event as React.FormEvent<HTMLElement>);
    }

    render() {
        const {
            value,
            className,
            tagName,
            isEditable,
            isFocused,
            caretPosition,
            onKeyDown,
            onKeyUp,
            onChange,
            ...props
        } = this.props;

        return React.createElement(tagName as string, {
            ref: "ContentEditable",
            className: classNames("ContentEditable", className),
            onClick: this.handleClick,
            onInput: this.emitChange,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,
            onKeyDown: this.emitKeyDown,
            onKeyUp: this.emitKeyUp,
            contentEditable: isEditable,
            dangerouslySetInnerHTML: { __html: value },
            ...props
        });
    }
}