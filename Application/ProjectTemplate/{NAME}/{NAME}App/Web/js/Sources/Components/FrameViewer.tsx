import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as classNames from 'classnames';

type TFrameViewerProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement> & {
	src: string;
    id?: string;
    className?: string;
    width?: number | string; 
    height?: number | string;
    frameBorder?: number | string;
    scrolling?: string;
};

export class FrameViewer extends React.Component<TFrameViewerProps> {

    static defaultProps = {
        width: "100%",
        height: 600,
        frameBorder: 0,
        scrolling: "auto"
	};

	shouldComponentUpdate(nextProps: TFrameViewerProps) {
		return (
			JSON.stringify(this.props) !== JSON.stringify(nextProps)
		);
	}

	render() {
		const { id, className, width, height, frameBorder, scrolling } = this.props;

		return (
			<iframe
				className={classNames("FrameViewer", className)}
				id={id}
				width={width}
				height={height}
				frameBorder={frameBorder}
				scrolling={scrolling}
				src={this.props.src}
			/>
		);
	}
}
