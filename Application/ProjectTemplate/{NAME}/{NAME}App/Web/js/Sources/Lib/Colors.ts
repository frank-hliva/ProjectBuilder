import "babel-polyfill"
import Immutable from 'immutable'

export function rgbToHex(r: number, g: number, b: number) {
    var bin = r << 16 | g << 8 | b;
    var h = bin.toString(16).toUpperCase();
    return '#' + (new Array(7 - h.length).join("0") + h)
}

export function parseRGBToHex(rgbValue: string) {
    const rgb = rgbValue.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

export function hexColor(color: string) {
    return color.startsWith("rgb") ? parseRGBToHex(color) : color;
}