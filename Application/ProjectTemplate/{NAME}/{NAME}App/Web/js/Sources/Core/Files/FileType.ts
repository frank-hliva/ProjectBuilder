import * as Path from '../IO/Path';

module FileType {

	export type TFileType = {
		ext: string;
		mimeType: string;
		category: string;
	}

	export type TCategoryIconMap = { [key: string]: string };

	export const fileTypes = require('../../../../data/fileTypes.json') as TFileType[];
	export const categoryIconMap = require('../../../../data/icons.json') as TCategoryIconMap;

	export function ofFileName(path: string) {
		const ext = (path.indexOf('.') === -1 ? path : Path.toExtension(path)).toLowerCase();
		return fileTypes.find(f => f.ext === ext) || null;
	}

	export function ofContentType(mimeType: string) {
		return fileTypes.find(f => f.mimeType === mimeType) || null;
	}

	export function getIconClass(path: string) {
		if (!path && path !== '') return 'fas fa-exclamation-triangle';
		const fileTypeInfo = ofFileName(path);
		return fileTypeInfo === null
			? 'far fa-file'
			: (categoryIconMap[fileTypeInfo.category] || 'far fa-file');
	}
	
}

export = FileType;