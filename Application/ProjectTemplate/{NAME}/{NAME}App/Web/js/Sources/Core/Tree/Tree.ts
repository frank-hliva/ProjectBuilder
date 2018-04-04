namespace Tree {

	export type TTreeNode = {
		name: string;
		nodeLevel: number;
		nodeType: string;
		children: TTreeNode[];
		uuid: string;
	};

	export type TFolderNode = TTreeNode & {
		isOpened: boolean | null;
	};

	export type TSelectableNode = TTreeNode & {
		isSelected: boolean;
	};

	export function forEach(tree: TTreeNode, action: (node: TTreeNode) => void) {
		action(tree);
		if (tree.children.length > 0) {
			tree.children.forEach(node => forEach(node, action));
		}
	}

	export function filter(tree: TTreeNode, predicate: (node: TTreeNode) => boolean, result: TTreeNode[] = []) {
		if (predicate(tree)) {
			result.push(tree);
		}
		if (tree.children.length > 0) {
			tree.children.forEach(node => filter(node, predicate, result));
		}
		return result;
	}

	export function find(tree: TTreeNode, predicate: (node: TTreeNode) => boolean) {
		if (predicate(tree)) return tree;
		else {
			for (let node of tree.children) {
				const result = find(node, predicate);
				if (result) return result;
			}
		}
		return null;
	}

	export function updateNode(tree: TTreeNode, newNode: TTreeNode) {
		const node = find(tree, node => node.uuid === newNode.uuid);
		for (let key in newNode) {
			if (['nodeLevel', 'nodeType', 'children', 'uuid'].indexOf(key) === -1) {
				node[key] = newNode[key];
			}
		}
		return tree;
	}
}

export = Tree;
