import './assets/NodeTreeView.styl';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Row, Col, Nav, ButtonGroup, Tab, NavItem, BreadcrumbItem } from 'react-bootstrap';
import * as Text from '../../Lib/Text';
import * as BaseTree from '../../Core/Tree/Tree'
import { TNode } from '../../App/Nodes/Tree';
import * as Icons from '../../Core/Files/Icons';
import { TreeView, TCommandEventArgs, ItemPosition } from './TreeView';
import { Commands } from './components/Commands';
import { TFolderNode } from '../../Core/Tree/Tree';
import { DirInfoView } from './components/DirInfoView';
import { TreeViewNode } from './components/TreeViewNode';

export class NodeTreeView extends TreeView {

	protected renderItemCommands(nodeComponent: TreeViewNode, node: TNode) {
		const commands = this.props.onCommandClick && (
			<Commands
				nodeComponent={nodeComponent}
				node={node}
				commands={[
					{ command: 'add', icon: <i className="fas fa-plus" /> },
					{ command: 'edit', icon: <i className="fas fa-pencil-alt" /> },
					...node.nodeLevel === 0
						? []
						: [{ command: 'delete', icon: <i className="fas fa-trash-alt" /> }]
				]}
				onClick={this.props.onCommandClick}
			/>
		);

		switch (node.nodeType) {
			case 'folder':
				return (
					<span>
						<DirInfoView node={node} />
						{commands}
					</span>
				);
			case 'file':
				return (
					<span>
						{commands}
					</span>
				);
			default:
				return null;
		}
	}

	protected renderIcon(node: TNode) {
		switch (node.nodeType) {
			case 'folder':
				return node.nodeLevel === 0
					? <i className="fas fa-user" />
					: super.renderIcon(node);
			default:
				return <i className={`${Icons.getIconClass(node.name)}`} />;
		}
	}

	protected get className() {
		return 'NodeTreeView TreeView';
	}

	renderItem(
		nodeComponent: TreeViewNode,
		node: BaseTree.TTreeNode,
		itemContent: JSX.Element | string,
		itemPosition: ItemPosition
	) {
		return node.nodeLevel === 0
			?
				<div className="Item">
					<div onClick={() => this.selectNode(nodeComponent, node)}>
						{this.renderIcon(node as TNode)}
						<div className="Content">{itemContent}</div>
					</div>
					{this.displayItemCommands(nodeComponent, node)}
				</div>
			:
				super.renderItem(nodeComponent, node, itemContent, itemPosition);
	}

	renderItemContent(node: TNode): JSX.Element | string {
		return node.Name;
	}
}
