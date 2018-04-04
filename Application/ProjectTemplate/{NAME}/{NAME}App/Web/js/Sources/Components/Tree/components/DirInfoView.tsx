import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as Tree from '../../../Core/Tree/Tree';
import { Lang } from '../../../Core/LangManager';
import lang from '../../../Core/LangManager';

export type TDirInfo = {
	folder: number;
	file: number;
} & { [key: string]: number };

type TDirInfoProps = {
	node: Tree.TTreeNode;
	children?: React.ReactNode;
};

export const DirInfoView: React.SFC<TDirInfoProps> = ({ node, children }) => {
	const info = node.children.reduce(
		(info: TDirInfo, node) => ({ ...info, [node.nodeType]: info[node.nodeType] + 1 }),
		{ folder: 0, file: 0 }
	);

	return info.folder > 0 || info.file > 0 || children
		?
			<small className="DirInfo">
				[{[
					['folder', 'file']
						.map(
							key =>
								info[key] > 0 &&
								`${info[key]} ${lang.value[`${key.toUpperCase()}${Lang.inflectionSuffix(info[key])}`]}`
						)
						.filter(value => !!value)
						.join(' / '),
					...(children === undefined ? [] : [children])
				]}]
			</small>
		:
			<span />
};
