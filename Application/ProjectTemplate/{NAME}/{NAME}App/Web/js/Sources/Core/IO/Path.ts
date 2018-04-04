namespace Path {
	export function toExtension(path: string) {
		return path.indexOf('.') === -1 ? '' : (path.split('.').pop() as string);
	}

	export function toFileName(path: string) {
		return path.split('/').pop() as string;
	}

	export function toFileNameWithoutExtension(path: string) {
		const fileName = Path.toFileName(path),
			pos = fileName.lastIndexOf('.');
		return pos === -1 ? fileName : fileName.substring(0, pos);
	}
}

export = Path;
