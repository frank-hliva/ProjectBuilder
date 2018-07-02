import './assets/ScrollBox.styl';

import * as React from 'react';
import * as classNames from 'classnames';

type TScrollBoxProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
}

export class ScrollBox extends React.Component<TScrollBoxProps> {
	render() {
		const { className, ...props } = this.props;

		return (
			<div
                className={classNames("ScrollBox", className)}
				{...props}
			/>
		);
	}
}