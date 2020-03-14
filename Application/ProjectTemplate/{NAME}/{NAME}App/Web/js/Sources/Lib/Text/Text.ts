import { Regex } from './Regex';

export module Text {
	export const trunc = (input: string, n: number, after: string = ' …') =>
		input.length > n ? `${input.substr(0, n - 1)}${after}` : input;

	export const ucfirst = (input: string) => input.charAt(0).toLocaleUpperCase() + input.slice(1);

	export const replace = (input: string, oldValue: string, newValue: string, flags: string = 'g') =>
		input.replace(RegExp(`(${Regex.escape(oldValue)})`, flags), newValue);
		
	export const highlight = (input: string, oldValue: string, highlight: string = '<b>$1</b>', flags: string = 'gi') =>
		replace(input, oldValue, highlight, flags);

	export const format = (input: string, ...args: any[]) =>
		input.replace(/{(\d+)}/g, (match, number) => (typeof args[number] != 'undefined' ? args[number] : match));

	export const isLowerCase = (input: string) =>
		input === input.toLocaleLowerCase() &&
		input !== input.toLocaleUpperCase()

	export const isUpperCase = (input: string) =>
		input === input.toLocaleUpperCase() &&
		input !== input.toLocaleLowerCase()

	const convertCase = (ucFirst: boolean, snakeCaseInput: string) =>
		snakeCaseInput
			.split('')
			.reduce(([upper, acc], e) => (e === '_' ? [true, acc] : [false, acc + (upper ? e.toUpperCase() : e)]), [
				ucFirst,
				''
			])[1];

	export const toCamelCase = (snakeCaseInput: string) => convertCase(false, snakeCaseInput);

	export const toPascalCase = (snakeCaseInput: string) => convertCase(true, snakeCaseInput);

	export const toSnakeCase = (camelCaseInput: string, ignoreFirst: boolean = true) =>
		camelCaseInput
			.split('')
			.reduce((acc, e, k) =>
				`${acc}${isUpperCase(e) && !(ignoreFirst && k === 0) ? '_' : ''}${e.toLocaleLowerCase()}`, ''
			)

	export function fromUint8Array(uint8Array: Uint8Array) {
		const chunkSize = 0x8000;
		let strings: string[] = [];
		for (let i = 0; i < uint8Array.length; i += chunkSize) {
			strings.push(String.fromCharCode.apply(null, uint8Array.subarray(i, i + chunkSize) as any));
		}
		return strings.join('');
	}

	export function formatBytes(bytes: number, decimals = 2) {
		if (bytes == 0) return '0 B';
		const k = 1024,
			sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
			i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
	}

	export const isTranslatable = (value: string) => value.startsWith('{{') && value.endsWith('}}');

	export const isTranslated = (value: string) => !isTranslatable(value);
}
