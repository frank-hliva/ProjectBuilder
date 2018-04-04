import * as React from 'react';
import * as Tree from '../../../Core/Tree/Tree';
import { TCommandEventArgs } from '../TreeView';
import { TreeViewNode } from './TreeViewNode';
import { NodeCommandsLoading } from './lib/NodeCommandsLoading';
import lang from '../../../Core/LangManager'

type TCommand = {
	command: string;
	icon: JSX.Element | null;
};

type TCommandsProps = {
	node: Tree.TTreeNode;
	nodeComponent: TreeViewNode;
	commands: TCommand[];
	onClick: (event: TCommandEventArgs) => void;
};

export const Commands: React.SFC<TCommandsProps> = function<T>({ nodeComponent, node, commands, onClick }) {
	return (
		<nav className="Commands">
			{commands.map(({ command, icon }: TCommand) => {
				const loading = new NodeCommandsLoading(node).has(command);
				return (
					<a
						key={command}
						href="javascript:void(0)"
						onClick={() => {
							if (!loading && onClick)
								onClick({
									target: {
										component: nodeComponent,
										value: command,
										command,
										node
									}
								});
						}}
						title={lang.value[`fs_tree_nav_${command}`]}
					>
						{loading ? <i className="fa fa-refresh fa-spin fa-fw" /> : icon}
					</a>
				);
			})}
		</nav>
	);
};
