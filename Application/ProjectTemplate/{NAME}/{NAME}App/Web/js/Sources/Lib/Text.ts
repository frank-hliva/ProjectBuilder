import { Regex } from './Regex';

export module Text {

    export function nl2br(text: string) {
        return (text + '').replace(/(\r\n|\n\r|\r|\n)/g, "<br/>");
    }

    export function br2nl(text: string) {
        return text.replace(/<br\/>/g, "\r");
    }

    export function removeDivs(text: string) {
        return text.replace(/<div>/gi, "").replace(/<\/div>/gi, "");
    }

    export function replaceFormatTags(text: string) {
        return text
            .replace(/<b>/gi, "<strong>")
            .replace(/<\/b>/gi, "</strong>")
            .replace(/<i>/gi, "<em>")
            .replace(/<\/i>/gi, "</em>");
    }

    export function convertToParagraphs(text: string) {
        const
            lineBreaksRemoved = text.replace(/\n/g, ""),
            wrappedInParagraphs = `<p>${lineBreaksRemoved}</p>`,
            brsRemoved = wrappedInParagraphs.replace(/<br[^>]*>[\s]*<br[^>]*>/gi, "</p>\n<p>");
        return brsRemoved.replace(/<p><\/p>/g, "");
    }

	export const trunc = (input: string, n: number, after: string = ' …') =>
		input.length > n ? `${input.substr(0, n - 1)}${after}` : input;

	export const ucfirst = (input: string) => input.charAt(0).toUpperCase() + input.slice(1);

	export const replace = (input: string, oldValue: string, newValue: string, flags: string = 'g') =>
		input.replace(RegExp(`(${Regex.escape(oldValue)})`, flags), newValue);

	export const highlight = (input: string, oldValue: string, highlight: string = '<b>$1</b>', flags: string = 'gi') =>
		replace(input, oldValue, highlight, flags);

	export const format = (input: string, ...args: any[]) =>
		input.replace(/{(\d+)}/g, (match, number) => (typeof args[number] != 'undefined' ? args[number] : match));

	const convertCase = (ucFirst: boolean, input: string) =>
		input
			.split('')
			.reduce(([upper, acc], e) => (e === '_' ? [true, acc] : [false, acc + (upper ? e.toUpperCase() : e)]), [
				ucFirst,
				''
			])[1];

	export const toCamelCase = (input: string) => convertCase(false, input);

	export const toPascalCase = (input: string) => convertCase(true, input);

	export function fromUint8Array(uint8Array: Uint8Array) {
		const chunkSize = 0x8000;
		let strings: string[] = [];
		for (let i = 0; i < uint8Array.length; i += chunkSize) {
			strings.push(String.fromCharCode.apply(null, uint8Array.subarray(i, i + chunkSize)));
		}
		return strings.join('');
	}
}