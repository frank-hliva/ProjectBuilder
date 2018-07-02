import './assets/TextLabel.styl';

import * as React from 'react';
import * as classNames from 'classnames';

type TTextLabelProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> & {

}

export class TextLabel extends React.Component<TTextLabelProps> {
    render() {
        const { className, ...props } = this.props;
        
        return (
            <span className={classNames("TextLabel", className)} {...props}>
                
            </span>
        )
    }
}