import React from 'react';
import * as Path from '../IO/Path';

export function getIconClass(path: string) {
	if (!path) return 'far fa-exclamation';
	switch (Path.toExtension(path).toLowerCase()) {
		case 'jpg':
		case 'jpeg':
		case 'jpe':
		case 'gif':
		case 'png':
		case 'svg':
		case 'psd':
		case 'tif':
		case 'tiff':
			return 'far fa-file-image-o';
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
			return 'far fa-file-video-o';
		case 'pdf':
			return 'far fa-file-pdf-o';
		case 'doc':
		case 'docx':
			return 'far fa-file-word-o';
		case 'xls':
		case 'xlsx':
			return 'far fa-file-excel-o';
		case 'ppt':
		case 'pptx':
			return 'far fa-file-powerpoint-o';
		case 'txt':
			return 'far fa-file-text-o';
		default:
			return 'far fa-file';
	}
}
