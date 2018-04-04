import './assets/TreeView.styl';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as Immutable from 'immutable';
import { Row, Col, Nav, ButtonGroup, Tab, NavItem, BreadcrumbItem } from 'react-bootstrap';
import { TFolderNode } from '../../Core/Tree/Tree';
import * as classNames from 'classnames';
import { TreeViewNode } from './components/TreeViewNode';
import * as Tree from '../../Core/Tree/Tree'

export const DEFAULT_TABKEY = 'files';

export enum TreeViewStyle {
	None,
	Panel
}

export enum SelectionMode {
	None,
	Single,
	Multi
}

export type TSelectionEventArgs = {
	target: {
		value: Tree.TTreeNode;
		selectedItem: Tree.TTreeNode;
		selectedItems: Tree.TTreeNode[];
	};
};

export type TCommandEventArgs = {
	target: {
		value: string;
		command: string;
		node: Tree.TTreeNode;
		component: TreeViewNode;
	};
};

export type TOpenFolderEventArgs = {
	target: {
		value: Tree.TTreeNode;
		node: Tree.TTreeNode;
		folderNode: Tree.TFolderNode;
		component: TreeViewNode;
	};
};

export type TLoadingNode = Tree.TTreeNode & {
	loading: boolean;
	loadingCommands?: string[];
};

export enum ItemPosition {
	First,
	Normal,
	Last
}

export enum TreeViewUpdateMode {
	Partial,
	Full
}

type TTreeViewProps = {
	tree: Tree.TTreeNode;
	id?: string;
	className?: string;
	treeViewStyle?: TreeViewStyle;
	heading?: string | JSX.Element;
	selectionMode?: SelectionMode;
	onSelected?: (event: TSelectionEventArgs) => void;
	onCommandClick?: (event: TCommandEventArgs) => void;
	onOpenFolder?: (event: TOpenFolderEventArgs) => void;
	uuid?: string;
	showItemCommands?: boolean;
	loading?: boolean;
	updateMode?: TreeViewUpdateMode;
};

export class TreeView extends React.Component<TTreeViewProps> {
	static defaultProps = {
		treeViewStyle: TreeViewStyle.Panel,
		selectionMode: SelectionMode.Single,
		heading: null,
		showItemCommands: true,
		loading: false,
		updateMode: TreeViewUpdateMode.Partial
	};

	protected _treeViewNodeMap: Immutable.Map<string, TreeViewNode> | null = null;
	protected _selectedItems: {
		node: Tree.TTreeNode;
		component: TreeViewNode;
	}[] = [];

	get treeViewNodeMap() {
		return this._treeViewNodeMap;
	}
	get selectedItems() {
		return this._selectedItems;
	}

	renderItemContent(node: Tree.TTreeNode): JSX.Element | string {
		return node.name;
	}

	protected renderIcon(node: Tree.TTreeNode) {
		switch (node.nodeType) {
			case 'root folder':
				return <i className="fas fa-folder" />;
			case 'folder':
				return <i className="fas fa-folder" />;
			default:
				return <i className="far fa-file" />;
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		switch (this.props.updateMode) {
			case TreeViewUpdateMode.Partial: {
				return (
					JSON.stringify(this.props.tree) !== JSON.stringify(nextProps.tree) ||
					this.props.uuid !== nextProps.uuid ||
					this.props.loading !== nextProps.loading
				);
			}
			default: {
				return true;
			}
		}
	}

	protected selectNode(nodeComponent: TreeViewNode, node: Tree.TTreeNode) {
		const selecteble = node as Tree.TSelectableNode;

		switch (this.props.selectionMode) {
			case SelectionMode.Single: {
				this._selectedItems.forEach(({ node, component }) => {
					(node as Tree.TSelectableNode).isSelected = false;
					component.forceUpdate();
				});
				selecteble.isSelected = true;
				this._selectedItems = [
					{
						node,
						component: nodeComponent
					}
				];
				nodeComponent.forceUpdate();
				break;
			}
			case SelectionMode.Multi: {
				selecteble.isSelected = !selecteble.isSelected;
				if (selecteble.isSelected) {
					this._selectedItems.push({
						node,
						component: nodeComponent
					});
					nodeComponent.forceUpdate();
				} else {
					const item = this._selectedItems.pop();
					if (item) item.component.forceUpdate();
				}
				break;
			}
			default: {
				break;
			}
		}

		if (this.props.selectionMode !== SelectionMode.None && this.props.onSelected) {
			this.props.onSelected({
				target: {
					value: node,
					selectedItem: node,
					selectedItems: this.selectedItems.map(({ node }) => node)
				}
			});
		}
	}

	protected renderItemCommands(
		nodeComponent: TreeViewNode,
		node: Tree.TTreeNode
	): string | JSX.Element | null | undefined {
		return null;
	}

	protected isOpenableNode(node: Tree.TTreeNode) {
		return node.children.length > 0;
	}

	protected openFolder(nodeComponent: TreeViewNode, node: Tree.TTreeNode) {
		if (this.props.onOpenFolder) {
			this.props.onOpenFolder({
				target: {
					value: node,
					node: node,
					folderNode: node as Tree.TFolderNode,
					component: nodeComponent
				}
			});
		} else {
			const folderNode = node as Tree.TFolderNode;
			folderNode.isOpened = !folderNode.isOpened;
			nodeComponent.forceUpdate();
		}
	}

	protected displayItemCommands(nodeComponent: TreeViewNode, node: Tree.TTreeNode) {
		return this.props.showItemCommands && this.renderItemCommands(nodeComponent, node);
	}

	renderItem(
		nodeComponent: TreeViewNode,
		node: Tree.TTreeNode,
		itemContent: JSX.Element | string,
		itemPosition: ItemPosition
	) {
		const pos = `Pos${ItemPosition[itemPosition]}`;

		switch (node.nodeType) {
			case 'root folder':
				return (
					<div className="Item">
						<div>
							{this.renderIcon(node)}
							<div className="Content">{itemContent}</div>
						</div>
						{this.displayItemCommands(nodeComponent, node)}
					</div>
				);
			case 'folder':
				return (
					<div className="Item">
						{((node as Tree.TTreeNode) as TLoadingNode).loading
							?
								<span className={classNames('TreeNodeIcon', pos)}>
									<i className="opening-node far fa-refresh fa-spin fa-fw" />
								</span>
							:
								<span
									className={classNames('TreeNodeIcon', { FolderIcon: this.isOpenableNode(node) }, pos)}
									onClick={() => this.openFolder(nodeComponent, node)}
								/>
						}
						<div
							onClick={() => {
								this.selectNode(nodeComponent, node);
							}}
						>
							{this.renderIcon(node)}
							<div className="Content">{itemContent}</div>
						</div>
						{this.displayItemCommands(nodeComponent, node)}
					</div>
				);
			default:
				return (
					<div className="Item">
						<span className={classNames('TreeNodeIcon', pos)} />
						<div
							onClick={() => {
								this.selectNode(nodeComponent, node);
							}}
						>
							{this.renderIcon(node)}
							<div className="Content">{itemContent}</div>
						</div>
						{this.displayItemCommands(nodeComponent, node)}
					</div>
				);
		}
	}

	toItemPosition(index: number, childrenCount: number) {
		if (index === childrenCount - 1) return ItemPosition.Last;
		else if (index === 0) return ItemPosition.First;
		else return ItemPosition.Normal;
	}

	protected get className() {
		return 'TreeView';
	}

	addToNodeMap(uuid: string, treeViewNode: TreeViewNode) {
		if (this._treeViewNodeMap) {
			this._treeViewNodeMap = this._treeViewNodeMap.set(uuid, treeViewNode);
		}
	}

	renderRoot() {
		const { tree, loading } = this.props;
		if (!loading) this._treeViewNodeMap = Immutable.Map();

		return loading
			?
				<span>SPINNER</span>
			:
				<ul className="Root">
					<TreeViewNode node={tree} index={0} owner={this} itemPosition={ItemPosition.First} uuid={tree.uuid} />
				</ul>
	}

	render() {
		const { id, className, treeViewStyle, heading } = this.props;

		switch (treeViewStyle) {
			case TreeViewStyle.Panel:
				return (
					<div id={id} className={classNames(this.className, className)}>
						<div className="panel panel-default">
							{heading && <div className="panel-heading">{heading}</div>}
							<div className="panel-body">{this.renderRoot()}</div>
						</div>
					</div>
				);
			case TreeViewStyle.None:
				return (
					<div id={id} className={classNames(this.className, className)}>
						{this.renderRoot()}
					</div>
				);
		}
	}
}
