import * as Path from '../IO/Path';

namespace FileType {
	export enum FileTypes {
		Default,
		Image,
		Video,
		Pdf,
		Document,
		Text
	}

	export function ofFileName(path: string) {
		switch ((path.indexOf('.') === -1 ? path : Path.toExtension(path)).toLowerCase()) {
			case 'jpg':
			case 'jpeg':
			case 'jpe':
			case 'gif':
			case 'png':
			case 'svg':
			case 'psd':
			case 'tif':
			case 'tiff':
				return FileTypes.Image;
			case 'avi':
			case 'mkv':
			case 'mp4':
			case 'divx':
			case 'xvid':
			case 'mpg':
			case 'webm':
			case 'vp8':
			case 'vp9':
			case 'flv':
				return FileTypes.Video;
			case 'pdf':
				return FileTypes.Pdf;
			case 'doc':
			case 'docx':
			case 'xls':
			case 'xlsx':
			case 'ppt':
			case 'pptx':
				return FileTypes.Document;
			case 'txt':
				return FileTypes.Text;
			default:
				return FileTypes.Default;
		}
	}
}

export = FileType;
