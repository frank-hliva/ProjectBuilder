import * as React from 'react';
import * as classNames from 'classnames';
import * as Text from '../../../Lib/Text'
import * as Tree from '../../../Core/Tree/Tree';
import { TSelectableNode } from '../../../Core/Tree/Tree';
import { TreeView, ItemPosition } from '../TreeView';

type TNodeProps = {
	node: Tree.TTreeNode;
	index: number;
	owner: TreeView;
	itemPosition: ItemPosition;
	uuid: string;
	parentComponent?: TreeViewNode;
};

export class TreeViewNode extends React.Component<TNodeProps> {
	constructor(props: TNodeProps) {
		super(props);
		const treeView = props.owner;
		const { node } = props;

		treeView.addToNodeMap(node.uuid, this);
		if ((node as TSelectableNode).isSelected) {
			treeView.selectedItems.push({ node, component: this });
		}
	}

	get parentComponent() {
		return this.props.parentComponent;
	}

	render() {
		const { node, index, owner, itemPosition } = this.props;
		const childrenCount = node.children.length;
		const folderNode = node as Tree.TFolderNode;
		const selecteble = node as Tree.TSelectableNode;

		return (
			<li
				key={`${node.name}${index}`}
				className={classNames(Text.ucfirst(node.nodeType), (node as any).classNames, {
					Closed: node.nodeType === 'folder' && !folderNode.isOpened,
					Selected: selecteble.isSelected
				})}
			>
				{owner.renderItem(this, node, owner.renderItemContent(node), itemPosition)}
				{childrenCount > 0 &&
					<ul>
						{folderNode.isOpened !== false &&
							node.children.map((node, index) => (
								<TreeViewNode
									key={node.uuid}
									uuid={node.uuid}
									node={node}
									index={index}
									owner={owner}
									parentComponent={this}
									itemPosition={owner.toItemPosition(index, childrenCount)}
								/>
							))}
					</ul>
				}
			</li>
		);
	}
}
