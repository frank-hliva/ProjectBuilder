import './assets/PictureBox.styl';

import * as React from 'react';
import * as classNames from 'classnames';

export enum BackgroundSize {
	auto,
	length,
	cover,
	contain,
	initial,
	inherit
}

type TPictureBoxProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
	width?: string;
	height?: string;
	className?: string;
	src: string;
	size?: BackgroundSize;
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void;
	onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
	onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
	onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export class PictureBox extends React.Component<TPictureBoxProps> {

    static defaultProps = {
        size: BackgroundSize.auto
	}
	
	render() {
		const { width, height, className, src, size, ...props } = this.props;

		return (
			<div className={classNames('PictureBox', className)} {...props}>
				<div
					className="Image"
					style={{
						backgroundImage: `url('${src}')`,
						backgroundSize: BackgroundSize[size as BackgroundSize],
						width,
						height
					}}
				/>
			</div>
		);
	}
	
}
