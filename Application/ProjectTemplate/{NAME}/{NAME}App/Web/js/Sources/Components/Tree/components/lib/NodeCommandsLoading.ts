import * as Tree from '../../../../Core/Tree/Tree';
import { TLoadingNode } from '../../TreeView';

export class NodeCommandsLoading {
	private readonly node: TLoadingNode;

	constructor(node: Tree.TTreeNode) {
		this.node = node as TLoadingNode;
	}

	add(command: string) {
		this.node.loadingCommands = this.node.loadingCommands
			? [...this.node.loadingCommands, command]
			: [command];
	}

	has(command: string): boolean {
		return (
			!!this.node.loadingCommands &&
			this.node.loadingCommands.indexOf(command) !== -1
		);
	}

	stop(command: string) {
		this.node.loadingCommands =
			this.node.loadingCommands
				? this.node.loadingCommands.filter(c => c !== command)
				: undefined;
	}
}
