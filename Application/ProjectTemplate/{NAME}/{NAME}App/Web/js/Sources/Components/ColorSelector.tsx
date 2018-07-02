import './assets/ColorSelector.styl';

import * as React from 'react';
import * as classNames from 'classnames';
import lang from '../Core/LangManager';

export type TColorItem = {} & {
	color: string;
	value: string;
	[key: string]: string;
}

export type TColorSelectorChangeEventArgs = {
	target: {
		value: string;
		item: TColorItem;
	}
}

type TColorSelectorProps = {
	onChange?: (event: TColorSelectorChangeEventArgs) => void;
	items: TColorItem[];
	value: string;
	titleIsEnabled?: boolean;
}

export class ColorSelector extends React.Component<TColorSelectorProps> {
	static defaultProps = {
		titleIsEnabled: false
	};

	handleClick(event) {
		if (this.props.onChange) {
			this.props.onChange(event);
		}
	}

	render() {
		const { items, value, titleIsEnabled } = this.props;
		return (
			<div className="ColorSelector">
				{items.map((i, k) => (
					<div
						key={`${i.value}-${k}`}
						className={classNames('ColorBox', { Selected: i.value === value })}
						title={titleIsEnabled ? lang.getUcf(`COLOR_VALUE_${i.value}`) : undefined}
						style={{ background: i.color }}
						onClick={this.handleClick.bind(this, {
							target: { value: i.value, item: i }
						})}
					/>
				))}
			</div>
		);
	}
}