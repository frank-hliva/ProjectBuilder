import * as React from 'react';
import * as classNames from 'classnames';
import { TextChangeEventArgs } from '../Core/TextEditing';

type TContentEditableProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    value: string;
    tagName?: string;
    onChange?: (event: TextChangeEventArgs) => void;
    isEditable?: boolean;
    isFocused?: boolean;
    className?: string;
}

export class ContentEditable extends React.Component<TContentEditableProps> {

    static defaultProps = {
        tagName: 'div',
        isEditable: true,
        isFocused: false
    }

    private lastValue: string = '';

    componentDidMount() {
        if (this.props.isFocused) {
            this.editor.focus();
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

    protected emitChange = (event) => {
        const value = this.editor.innerHTML;

        if (this.props.onChange && value !== this.lastValue) {
            this.props.onChange({ target: { value } });
        }
        this.lastValue = value;
    }

    render() {
        const {
            value,
            className,
            tagName,
            isEditable,
            ...props
        } = this.props;

        return React.createElement(tagName as string, {
            ref: "ContentEditable",
            className: classNames("ContentEditable", className),
            onInput: this.emitChange,
            onBlur: this.emitChange,
            contentEditable: isEditable,
            dangerouslySetInnerHTML: { __html: value },
            ...props
        });
    }
}